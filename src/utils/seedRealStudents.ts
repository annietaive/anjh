// Script to seed 60 real students with learning data for listening, speaking, reading, writing
import { getSupabaseClient } from './supabase/client';

interface StudentData {
  name: string;
  email: string;
  username: string;
  grade: number;
  password: string;
}

// 60 students - 15 per grade (6, 7, 8, 9)
const students: StudentData[] = [
  // Grade 6 - 15 students
  { name: 'Nguyễn Trường An', email: 'truongan111112@gmail.com', username: 'truongan111112', grade: 6, password: 'Student123!' },
  { name: 'Trần Minh Khoa', email: 'khoa.tm92@gmail.com', username: 'khoa.tm92', grade: 6, password: 'Student123!' },
  { name: 'Lê Ngọc Linh', email: 'linhle_0305@gmail.com', username: 'linhle_0305', grade: 6, password: 'Student123!' },
  { name: 'Phạm Gia Hân', email: 'giahan.p@gmail.com', username: 'giahan.p', grade: 6, password: 'Student123!' },
  { name: 'Vũ Đức Long', email: 'long.vd88@gmail.com', username: 'long.vd88', grade: 6, password: 'Student123!' },
  { name: 'Đặng Thảo My', email: 'mydang.cloud@gmail.com', username: 'mydang.cloud', grade: 6, password: 'Student123!' },
  { name: 'Bùi Thanh Tùng', email: 'tungbt_1999@gmail.com', username: 'tungbt_1999', grade: 6, password: 'Student123!' },
  { name: 'Hồ Nhật Nam', email: 'nam.ho.sun@gmail.com', username: 'nam.ho.sun', grade: 6, password: 'Student123!' },
  { name: 'Dương Khánh Vy', email: 'vy.kduong@gmail.com', username: 'vy.kduong', grade: 6, password: 'Student123!' },
  { name: 'Cao Minh Quân', email: 'cmquan_777@gmail.com', username: 'cmquan_777', grade: 6, password: 'Student123!' },
  { name: 'Lý Hoàng Phúc', email: 'phuc.lyh@gmail.com', username: 'phuc.lyh', grade: 6, password: 'Student123!' },
  { name: 'Phan Thùy Trang', email: 'trangpt.moon@gmail.com', username: 'trangpt.moon', grade: 6, password: 'Student123!' },
  { name: 'Tạ Anh Tuấn', email: 'tuan.ta.a@gmail.com', username: 'tuan.ta.a', grade: 6, password: 'Student123!' },
  { name: 'Mai Quỳnh Anh', email: 'quynhanhmai@gmail.com', username: 'quynhanhmai', grade: 6, password: 'Student123!' },
  { name: 'Trịnh Quốc Bảo', email: 'bao.trinhq@gmail.com', username: 'bao.trinhq', grade: 6, password: 'Student123!' },

  // Grade 7 - 15 students
  { name: 'Nguyễn Mỹ Duyên', email: 'duyen.ngm@gmail.com', username: 'duyen.ngm', grade: 7, password: 'Student123!' },
  { name: 'Lê Huy Hoàng', email: 'hoanglh.dev@gmail.com', username: 'hoanglh.dev', grade: 7, password: 'Student123!' },
  { name: 'Phạm Tuấn Kiệt', email: 'kietptx@gmail.com', username: 'kietptx', grade: 7, password: 'Student123!' },
  { name: 'Vũ Kim Ngân', email: 'nganvk.cute@gmail.com', username: 'nganvk.cute', grade: 7, password: 'Student123!' },
  { name: 'Trần Đức Minh', email: 'minh.trand@gmail.com', username: 'minh.trand', grade: 7, password: 'Student123!' },
  { name: 'Hoàng Nhật Minh', email: 'nhatminh.h@gmail.com', username: 'nhatminh.h', grade: 7, password: 'Student123!' },
  { name: 'Bùi Gia Bảo', email: 'baobg_0102@gmail.com', username: 'baobg_0102', grade: 7, password: 'Student123!' },
  { name: 'Đỗ Thảo Nguyên', email: 'nguyen.do.t@gmail.com', username: 'nguyen.do.t', grade: 7, password: 'Student123!' },
  { name: 'Nguyễn Khánh Linh', email: 'khlinh_ng@gmail.com', username: 'khlinh_ng', grade: 7, password: 'Student123!' },
  { name: 'Lê Anh Duy', email: 'duy.lea@gmail.com', username: 'duy.lea', grade: 7, password: 'Student123!' },
  { name: 'Phạm Quốc Thịnh', email: 'thinh.pq@gmail.com', username: 'thinh.pq', grade: 7, password: 'Student123!' },
  { name: 'Vũ Thanh Hà', email: 'ha.vth@gmail.com', username: 'ha.vth', grade: 7, password: 'Student123!' },
  { name: 'Trần Ngọc Anh', email: 'anhngoc.tr@gmail.com', username: 'anhngoc.tr', grade: 7, password: 'Student123!' },
  { name: 'Hồ Minh Phát', email: 'phat.ho_m@gmail.com', username: 'phat.ho_m', grade: 7, password: 'Student123!' },
  { name: 'Đặng Yến Nhi', email: 'nhi.yen.d@gmail.com', username: 'nhi.yen.d', grade: 7, password: 'Student123!' },

  // Grade 8 - 15 students
  { name: 'Nguyễn Hải Đăng', email: 'dangnh.ai@gmail.com', username: 'dangnh.ai', grade: 8, password: 'Student123!' },
  { name: 'Trần Thu Trang', email: 'trang.ttx@gmail.com', username: 'trang.ttx', grade: 8, password: 'Student123!' },
  { name: 'Lê Quốc Việt', email: 'viet.leq@gmail.com', username: 'viet.leq', grade: 8, password: 'Student123!' },
  { name: 'Phạm Ngọc Bảo', email: 'baongo.p@gmail.com', username: 'baongo.p', grade: 8, password: 'Student123!' },
  { name: 'Vũ Thảo Vy', email: 'vyvt.spark@gmail.com', username: 'vyvt.spark', grade: 8, password: 'Student123!' },
  { name: 'Đỗ Minh Quang', email: 'quangdm_404@gmail.com', username: 'quangdm_404', grade: 8, password: 'Student123!' },
  { name: 'Cao Thị Mai', email: 'maicao.t@gmail.com', username: 'maicao.t', grade: 8, password: 'Student123!' },
  { name: 'Hồ Gia Huy', email: 'huy.hogia@gmail.com', username: 'huy.hogia', grade: 8, password: 'Student123!' },
  { name: 'Trịnh Thanh Tâm', email: 'tam.ttt@gmail.com', username: 'tam.ttt', grade: 8, password: 'Student123!' },
  { name: 'Bùi Phương Linh', email: 'linhbp.flow@gmail.com', username: 'linhbp.flow', grade: 8, password: 'Student123!' },
  { name: 'Nguyễn Tuệ Anh', email: 'anhtue.ng@gmail.com', username: 'anhtue.ng', grade: 8, password: 'Student123!' },
  { name: 'Phan Minh Đức', email: 'duc.pm@gmail.com', username: 'duc.pm', grade: 8, password: 'Student123!' },
  { name: 'Lê Khánh Toàn', email: 'toan.lk@gmail.com', username: 'toan.lk', grade: 8, password: 'Student123!' },
  { name: 'Vũ Hoàng Yến', email: 'yenvh.blue@gmail.com', username: 'yenvh.blue', grade: 8, password: 'Student123!' },
  { name: 'Đặng Đức Huy', email: 'huydd_x@gmail.com', username: 'huydd_x', grade: 8, password: 'Student123!' },

  // Grade 9 - 15 students
  { name: 'Mai Thanh Phong', email: 'phong.mai@gmail.com', username: 'phong.mai', grade: 9, password: 'Student123!' },
  { name: 'Trần Gia Linh', email: 'giatr.linh@gmail.com', username: 'giatr.linh', grade: 9, password: 'Student123!' },
  { name: 'Nguyễn Quốc Anh', email: 'anh.nqz@gmail.com', username: 'anh.nqz', grade: 9, password: 'Student123!' },
  { name: 'Bùi Nhật Hào', email: 'haobj.n@gmail.com', username: 'haobj.n', grade: 9, password: 'Student123!' },
  { name: 'Phạm Thùy Dung', email: 'dung.ptw@gmail.com', username: 'dung.ptw', grade: 9, password: 'Student123!' },
  { name: 'Hồ Thế Anh', email: 'anh.hothe@gmail.com', username: 'anh.hothe', grade: 9, password: 'Student123!' },
  { name: 'Lý Minh Châu', email: 'chau.lm@gmail.com', username: 'chau.lm', grade: 9, password: 'Student123!' },
  { name: 'Trần Bảo Ngọc', email: 'ngoc.tbk@gmail.com', username: 'ngoc.tbk', grade: 9, password: 'Student123!' },
  { name: 'Nguyễn Hoài Nam', email: 'nam.hoai.ng@gmail.com', username: 'nam.hoai.ng', grade: 9, password: 'Student123!' },
  { name: 'Đỗ Gia Phúc', email: 'phuc.dg@gmail.com', username: 'phuc.dg', grade: 9, password: 'Student123!' },
  { name: 'Vũ Minh Thảo', email: 'thao.vm@gmail.com', username: 'thao.vm', grade: 9, password: 'Student123!' },
  { name: 'Lê Tường Vy', email: 'vylt_09@gmail.com', username: 'vylt_09', grade: 9, password: 'Student123!' },
  { name: 'Phạm Anh Khoa', email: 'khoapa@gmail.com', username: 'khoapa', grade: 9, password: 'Student123!' },
  { name: 'Trịnh Mỹ Linh', email: 'linh.trm@gmail.com', username: 'linh.trm', grade: 9, password: 'Student123!' },
  { name: 'Nguyễn Nhật Quỳnh', email: 'quynh.nn@gmail.com', username: 'quynh.nn', grade: 9, password: 'Student123!' },
];

// Helper function to generate random score with normal distribution
function randomScore(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  const score = Math.round(mean + z * stdDev);
  return Math.max(0, Math.min(100, score));
}

// Helper function to delay execution
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to retry with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      if (error.message?.includes('rate limit')) {
        const delayTime = initialDelay * Math.pow(2, i);
        console.log(`⏳ Rate limit hit, waiting ${delayTime}ms before retry ${i + 1}/${maxRetries}...`);
        await delay(delayTime);
      } else {
        throw error; // Don't retry non-rate-limit errors
      }
    }
  }
  
  throw lastError;
}

// Generate learning data for a student
function generateLearningData(grade: number, studentIndex: number) {
  const unitsPerGrade = 12;
  const startUnit = (grade - 6) * unitsPerGrade + 1;
  const endUnit = startUnit + unitsPerGrade - 1;
  
  // Random progress (20-90% of units)
  const progressRate = 0.2 + Math.random() * 0.7;
  const unitsCompleted = Math.floor(unitsPerGrade * progressRate);
  
  // Skill proficiency - varied per student
  const baseProficiency = 50 + (studentIndex % 30); // 50-80 range
  const listeningSkill = baseProficiency + randomScore(0, 15);
  const speakingSkill = baseProficiency + randomScore(-5, 15);
  const readingSkill = baseProficiency + randomScore(5, 12);
  const writingSkill = baseProficiency + randomScore(-10, 15);
  
  return {
    unitsCompleted,
    startUnit,
    endUnit,
    skills: {
      listening: Math.max(30, Math.min(100, listeningSkill)),
      speaking: Math.max(25, Math.min(100, speakingSkill)),
      reading: Math.max(35, Math.min(100, readingSkill)),
      writing: Math.max(20, Math.min(100, writingSkill)),
    }
  };
}

// Main seeding function
export async function seedRealStudents() {
  console.log('🌱 Bắt đầu thêm 60 học sinh vào database...');
  
  try {
    const supabase = await getSupabaseClient();
    
    // Test connection with better error handling
    console.log('🔌 Testing Supabase connection...');
    let testError: any = null;
    
    try {
      const { data: testData, error: err } = await supabase
        .from('user_profiles')
        .select('user_id')
        .limit(1);
      testError = err;
    } catch (fetchError: any) {
      console.error('Connection test failed:', fetchError);
      throw new Error(
        '❌ Không thể kết nối đến Supabase!\n\n' +
        'Nguyên nhân có thể:\n' +
        '1. Chưa kết nối Supabase (nhấn nút "Connect Supabase" góc trên phải)\n' +
        '2. Supabase URL hoặc API key không đúng\n' +
        '3. Supabase project chưa được tạo\n' +
        '4. Network/CORS issues\n\n' +
        `Chi tiết lỗi: ${fetchError.message || 'Failed to fetch'}`
      );
    }
    
    if (testError) {
      if (testError.message?.includes('Failed to fetch') || testError.message?.includes('FetchError')) {
        throw new Error(
          '❌ Không thể kết nối đến Supabase!\n\n' +
          'Vui lòng kiểm tra:\n' +
          '1. Đã kết nối Supabase chưa? (nút "Connect Supabase")\n' +
          '2. Supabase URL có đúng không?\n' +
          '3. API key có hợp lệ không?\n\n' +
          'Nếu chưa kết nối, vui lòng:\n' +
          '• Click "Connect Supabase" ở góc trên phải\n' +
          '• Nhập Project URL và Service Role Key\n' +
          '• Sau đó quay lại và thử seed lại'
        );
      }
      throw new Error(`Database error: ${testError.message}`);
    }
    
    console.log('✅ Supabase connection verified');
    
    // Verify all required tables exist
    console.log('🔍 Checking database tables...');
    const requiredTables = [
      'user_profiles',
      'learning_progress', 
      'exercise_results',
      'daily_activities',
      'learning_analytics'
    ];
    
    for (const tableName of requiredTables) {
      const { error: tableError } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (tableError) {
        if (tableError.message.includes('Could not find the table') || 
            tableError.message.includes('relation') && tableError.message.includes('does not exist')) {
          throw new Error(
            `❌ Bảng '${tableName}' chưa được tạo!\n\n` +
            `Vui lòng làm theo hướng dẫn:\n` +
            `1. Mở Supabase Dashboard → SQL Editor\n` +
            `2. Copy toàn bộ file /docs/database-schema.sql\n` +
            `3. Paste và nhấn "Run"\n` +
            `4. Quay lại và thử seed lại\n\n` +
            `Thiếu bảng: ${tableName}`
          );
        }
      }
      console.log(`✅ Table '${tableName}' exists`);
    }
    
    console.log('✅ All required tables verified');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      console.log(`\n📝 Processing ${i + 1}/60: ${student.name} (Grade ${student.grade})`);
      
      try {
        // 1. Sign up the student (creates auth.users entry) with retry
        const authData = await retryWithBackoff(async () => {
          const { data, error } = await supabase.auth.signUp({
            email: student.email,
            password: student.password,
            options: {
              data: {
                name: student.name,
                username: student.username,
                grade: student.grade,
              }
            }
          });
          
          if (error) {
            // If user already exists, skip
            if (error.message.includes('already registered')) {
              console.log(`⚠️  User already exists, skipping: ${student.email}`);
              return null;
            }
            throw error;
          }
          
          return data;
        }, 5, 2000); // 5 retries, starting with 2 second delay
        
        if (!authData || !authData.user) {
          continue; // Skip to next student
        }
        
        const userId = authData.user.id;
        console.log(`✅ Created auth user: ${userId}`);
        
        // Delay before next API call
        await delay(1000);
        
        // 2. Create user profile with retry
        await retryWithBackoff(async () => {
          const { error } = await supabase
            .from('user_profiles')
            .insert({
              user_id: userId,
              name: student.name,
              username: student.username,
              email: student.email,
              grade: student.grade,
              role: 'student'
            });
          
          if (error) throw error;
        }, 5, 2000);
        
        console.log(`✅ Created user profile`);
        await delay(1000);
        
        // 3. Generate learning data
        const learningData = generateLearningData(student.grade, i);
        const { unitsCompleted, startUnit, endUnit, skills } = learningData;
        
        // 4. Create learning progress for completed units
        const progressRecords = [];
        
        if (progressRecords.length > 0) {
          const { error: progressError } = await supabase
            .from('learning_progress')
            .insert(progressRecords);
          
          if (progressError) throw progressError;
          console.log(`✅ Created ${progressRecords.length} progress records`);
        }
        
        // 5. Create exercise results for all 4 skills
        const exerciseResults = [];
        const skillTypes = ['listening', 'speaking', 'reading', 'writing'] as const;
        
        for (let unit = startUnit; unit < startUnit + unitsCompleted; unit++) {
          for (const skillType of skillTypes) {
            const numExercises = Math.floor(2 + Math.random() * 4); // 2-5 exercises per skill
            for (let ex = 0; ex < numExercises; ex++) {
              const totalQuestions = skillType === 'speaking' ? 5 : 10;
              const baseScore = skills[skillType];
              const score = randomScore(baseScore, 15);
              const correctAnswers = Math.round((score / 100) * totalQuestions);
              
              exerciseResults.push({
                user_id: userId,
                lesson_id: unit,
                exercise_type: skillType,
                score: score,
                total_questions: totalQuestions,
                correct_answers: correctAnswers,
                time_spent_seconds: Math.floor(180 + Math.random() * 420), // 3-10 minutes
                completed_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
              });
            }
          }
        }
        
        if (exerciseResults.length > 0) {
          // Insert in batches of 50 to avoid payload size limits
          for (let j = 0; j < exerciseResults.length; j += 50) {
            const batch = exerciseResults.slice(j, j + 50);
            const { error: resultsError } = await supabase
              .from('exercise_results')
              .insert(batch);
            
            if (resultsError) throw resultsError;
          }
          console.log(`✅ Created ${exerciseResults.length} exercise results (all 4 skills)`);
        }
        
        // 6. Create daily activities (random days in last 30 days)
        const dailyActivities = [];
        const daysActive = Math.floor(5 + Math.random() * 25); // 5-30 days
        const today = new Date();
        
        for (let d = 0; d < daysActive; d++) {
          const activityDate = new Date(today);
          activityDate.setDate(today.getDate() - Math.floor(Math.random() * 30));
          
          dailyActivities.push({
            user_id: userId,
            activity_date: activityDate.toISOString().split('T')[0],
            lessons_completed: Math.floor(1 + Math.random() * 3),
            exercises_completed: Math.floor(2 + Math.random() * 8),
            time_spent_minutes: Math.floor(20 + Math.random() * 80),
          });
        }
        
        if (dailyActivities.length > 0) {
          const { error: activitiesError } = await supabase
            .from('daily_activities')
            .insert(dailyActivities);
          
          if (activitiesError) {
            // Ignore duplicate date errors
            if (!activitiesError.message.includes('duplicate')) {
              throw activitiesError;
            }
          }
          console.log(`✅ Created ${dailyActivities.length} daily activities`);
        }
        
        // 7. Calculate and insert learning analytics
        const totalExercises = exerciseResults.length;
        const avgScore = exerciseResults.reduce((sum, r) => sum + r.score, 0) / totalExercises;
        
        const { error: analyticsError } = await supabase
          .from('learning_analytics')
          .insert({
            user_id: userId,
            total_lessons_completed: unitsCompleted,
            total_exercises_completed: totalExercises,
            total_time_spent_minutes: progressRecords.reduce((sum, r) => sum + r.time_spent_minutes, 0),
            average_score: avgScore,
            vocabulary_mastery: randomScore(skills.reading, 10),
            listening_mastery: skills.listening,
            speaking_mastery: skills.speaking,
            reading_mastery: skills.reading,
            writing_mastery: skills.writing,
            current_streak_days: Math.floor(Math.random() * 15),
            longest_streak_days: Math.floor(Math.random() * 30),
            last_activity_date: new Date().toISOString().split('T')[0],
          });
        
        if (analyticsError) throw analyticsError;
        console.log(`✅ Created learning analytics`);
        console.log(`📊 Skills - L:${skills.listening} S:${skills.speaking} R:${skills.reading} W:${skills.writing}`);
        
        successCount++;
        console.log(`✅ SUCCESS (${successCount}/${students.length})`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error: any) {
        errorCount++;
        console.error(`❌ ERROR for ${student.name}:`, error.message);
      }
    }
    
    console.log(`\n\n🎉 SEEDING COMPLETE!`);
    console.log(`✅ Success: ${successCount} students`);
    console.log(`❌ Errors: ${errorCount} students`);
    console.log(`📊 Total: ${students.length} students`);
    console.log(`\n📚 Data created for each student:`);
    console.log(`   - User profile (name, email, grade)`);
    console.log(`   - Learning progress (units completed)`);
    console.log(`   - Exercise results (Listening, Speaking, Reading, Writing)`);
    console.log(`   - Daily activities (learning streak)`);
    console.log(`   - Learning analytics (skill mastery)`);
    
  } catch (error: any) {
    console.error('❌ Fatal error during seeding:', error);
    throw error;
  }
}

// Run if executed directly
if (typeof window === 'undefined') {
  seedRealStudents().catch(console.error);
}