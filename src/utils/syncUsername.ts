// ============================================================================
// Username Sync Utilities
// ============================================================================
// Functions to sync username between localStorage and database
// ============================================================================

/**
 * Sync username from localStorage to database
 * Hữu ích khi username chỉ tồn tại trong localStorage nhưng chưa có trong DB
 */
export async function syncUsernameToDatabase(userId: string, username: string): Promise<boolean> {
  if (!userId || !username) {
    console.error('Cannot sync username: missing userId or username');
    return false;
  }

  try {
    const { getSupabaseClient } = await import('./supabase/client');
    const supabase = await getSupabaseClient();

    console.log('🔄 Syncing username to database...', { userId, username });

    let success = false;

    // Try to update user_profiles first (primary storage)
    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user_profiles:', fetchError);
      }

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ username })
          .eq('user_id', userId);

        if (updateError) {
          console.error('Failed to update user_profiles:', updateError);
        } else {
          console.log('✅ Updated username in user_profiles');
          success = true;
        }
      } else {
        // Profile doesn't exist - need to create it
        // Get user data from localStorage to fill in other fields
        const localUser = localStorage.getItem('user');
        const userData = localUser ? JSON.parse(localUser) : {};

        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: userId,
            name: userData.name || 'Unknown',
            username: username,
            email: userData.email || '',
            grade: userData.grade || 6,
            role: userData.role || 'student',
          });

        if (insertError) {
          console.error('Failed to insert user_profiles:', insertError);
        } else {
          console.log('✅ Created user_profiles with username');
          success = true;
        }
      }
    } catch (profileError) {
      console.warn('Could not sync to user_profiles:', profileError);
    }

    // kv_store is optional/legacy - don't fail if it doesn't work
    try {
      const { data: existingKv, error: kvFetchError } = await supabase
        .from('kv_store_bf8225f3')
        .select('*')
        .eq('key', `user:${userId}:profile`)
        .maybeSingle();

      if (kvFetchError) {
        console.log('⚠️ kv_store not accessible (this is OK)');
      } else if (existingKv) {
        // Update existing kv_store record
        const updatedValue = {
          ...existingKv.value,
          username: username,
        };

        const { error: kvUpdateError } = await supabase
          .from('kv_store_bf8225f3')
          .update({ value: updatedValue })
          .eq('key', `user:${userId}:profile`);

        if (!kvUpdateError) {
          console.log('✅ Updated username in kv_store');
        }
      }
    } catch (kvError) {
      // Silently ignore kv_store errors - it's not critical
      console.log('⚠️ kv_store sync skipped (table may not exist)');
    }

    if (success) {
      console.log('✅ Username sync complete');
    } else {
      console.warn('⚠️ Username sync may have failed - check logs above');
    }

    return success;
  } catch (error) {
    console.error('Error syncing username to database:', error);
    return false;
  }
}

/**
 * Get username from all sources and determine which is most authoritative
 */
export async function getAuthoritativeUsername(userId: string): Promise<string | null> {
  try {
    const { getSupabaseClient } = await import('./supabase/client');
    const supabase = await getSupabaseClient();

    console.log('🔍 Getting authoritative username for user:', userId);

    // Try user_profiles first (primary)
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('user_id', userId)
      .maybeSingle();

    if (profileError) {
      console.log('Error fetching from user_profiles:', profileError);
    }

    if (profileData?.username) {
      console.log('✅ Found username in user_profiles:', profileData.username);
      return profileData.username;
    }

    // Try kv_store (legacy)
    const { data: kvData, error: kvError } = await supabase
      .from('kv_store_bf8225f3')
      .select('value')
      .eq('key', `user:${userId}:profile`)
      .maybeSingle();

    if (kvError) {
      console.log('⚠️ kv_store not accessible');
    }

    if (kvData?.value?.username) {
      console.log('✅ Found username in kv_store:', kvData.value.username);
      return kvData.value.username;
    }

    // Try localStorage (last resort)
    const localUser = localStorage.getItem('user');
    if (localUser) {
      const userData = JSON.parse(localUser);
      if (userData.username) {
        console.log('✅ Found username in localStorage:', userData.username);
        return userData.username;
      }
    }

    console.log('❌ No username found in any storage');
    return null;
  } catch (error) {
    console.error('Error getting authoritative username:', error);
    return null;
  }
}

/**
 * Full sync: ensure username is consistent across all storages
 */
export async function ensureUsernameConsistency(userId: string): Promise<void> {
  try {
    console.log('🔍 Checking username consistency...');
    
    // Get username from most authoritative source
    const username = await getAuthoritativeUsername(userId);

    if (!username) {
      console.warn('⚠️ No username found in any storage');
      return;
    }

    console.log('📝 Found authoritative username:', username);

    // Sync to all storages
    await syncUsernameToDatabase(userId, username);

    // Update localStorage
    const localUser = localStorage.getItem('user');
    if (localUser) {
      const userData = JSON.parse(localUser);
      userData.username = username;
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('✅ Updated localStorage with username');
    }

    console.log('✅ Username consistency ensured');
  } catch (error) {
    console.error('Error ensuring username consistency:', error);
  }
}