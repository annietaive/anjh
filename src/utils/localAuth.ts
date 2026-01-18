// ============================================================================
// Local Authentication System (Offline Mode)
// ============================================================================
// Provides full authentication functionality using localStorage
// ============================================================================

interface LocalUser {
  id: string;
  email: string;
  name: string;
  grade: number;
  username: string;
  role: 'student' | 'teacher';
  createdAt: string;
}

interface LocalAuthData {
  users: Record<string, LocalUser>;
  passwords: Record<string, string>; // email -> hashed password
  sessions: Record<string, string>; // token -> userId
}

// Get auth data from localStorage
function getAuthData(): LocalAuthData {
  try {
    const data = localStorage.getItem('local_auth_data');
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading local auth data:', error);
  }
  
  return {
    users: {},
    passwords: {},
    sessions: {}
  };
}

// Save auth data to localStorage
function saveAuthData(data: LocalAuthData): void {
  try {
    localStorage.setItem('local_auth_data', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving local auth data:', error);
  }
}

// Simple hash function (NOT secure for production!)
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

// Generate unique ID
function generateId(): string {
  return 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Generate auth token
function generateToken(): string {
  return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16);
}

// Generate username from name
function generateUsername(name: string): string {
  const withoutAccents = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
  
  const username = withoutAccents
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
  
  return username;
}

// Ensure unique username
function ensureUniqueUsername(baseUsername: string, authData: LocalAuthData): string {
  let username = baseUsername;
  let counter = 1;
  
  const existingUsernames = Object.values(authData.users).map(u => u.username);
  
  while (existingUsernames.includes(username)) {
    username = `${baseUsername}${counter}`;
    counter++;
  }
  
  return username;
}

// ============================================================================
// Public API
// ============================================================================

export async function localSignup(
  email: string,
  password: string,
  name: string,
  grade: number,
  role: 'student' | 'teacher' = 'student'
): Promise<{ user: LocalUser; token: string }> {
  const authData = getAuthData();
  
  // Check if user already exists
  if (authData.passwords[email.toLowerCase()]) {
    throw new Error('Email đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.');
  }
  
  // Validate password
  if (password.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự.');
  }
  
  // Create new user
  const userId = generateId();
  const baseUsername = generateUsername(name);
  const username = ensureUniqueUsername(baseUsername, authData);
  
  const user: LocalUser = {
    id: userId,
    email: email.toLowerCase(),
    name,
    grade,
    username,
    role,
    createdAt: new Date().toISOString()
  };
  
  // Save user and password
  authData.users[userId] = user;
  authData.passwords[email.toLowerCase()] = simpleHash(password);
  
  // Create session
  const token = generateToken();
  authData.sessions[token] = userId;
  
  saveAuthData(authData);
  
  // Initialize user progress
  localStorage.setItem(`user:${userId}:progress`, JSON.stringify({
    totalLessons: 0,
    completedLessons: 0,
    totalExercises: 0,
    correctAnswers: 0,
    totalScore: 0,
  }));
  
  console.log('[LocalAuth] User created:', username);
  
  return { user, token };
}

export async function localLogin(
  email: string,
  password: string
): Promise<{ user: LocalUser; token: string }> {
  const authData = getAuthData();
  
  const emailLower = email.toLowerCase();
  const storedHash = authData.passwords[emailLower];
  
  if (!storedHash) {
    throw new Error('Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại hoặc đăng ký tài khoản mới.');
  }
  
  const passwordHash = simpleHash(password);
  
  if (storedHash !== passwordHash) {
    throw new Error('Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.');
  }
  
  // Find user
  const user = Object.values(authData.users).find(u => u.email === emailLower);
  
  if (!user) {
    throw new Error('Không tìm thấy thông tin người dùng.');
  }
  
  // Create new session
  const token = generateToken();
  authData.sessions[token] = user.id;
  
  saveAuthData(authData);
  
  console.log('[LocalAuth] User logged in:', user.username);
  
  return { user, token };
}

export async function localLogout(token: string): Promise<void> {
  const authData = getAuthData();
  
  delete authData.sessions[token];
  
  saveAuthData(authData);
  
  console.log('[LocalAuth] User logged out');
}

export async function getUserFromToken(token: string): Promise<LocalUser | null> {
  const authData = getAuthData();
  
  const userId = authData.sessions[token];
  
  if (!userId) {
    return null;
  }
  
  return authData.users[userId] || null;
}

export function isLocalAuthMode(): boolean {
  return localStorage.getItem('auth_mode') === 'local';
}

export function setAuthMode(mode: 'local' | 'supabase'): void {
  localStorage.setItem('auth_mode', mode);
}

// Create demo/test account if not exists
export async function ensureTestAccount(): Promise<void> {
  const authData = getAuthData();
  
  if (!authData.passwords['test@engmastery.com']) {
    await localSignup('test@engmastery.com', 'test123', 'Test User', 6, 'student');
    console.log('[LocalAuth] Test account created');
  }
}
