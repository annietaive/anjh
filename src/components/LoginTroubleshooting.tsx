import { AlertCircle, CheckCircle, XCircle, UserPlus, Key } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function LoginTroubleshooting() {
  return (
    <Card className="mt-4 border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2 text-orange-700">
          <AlertCircle className="h-4 w-4" />
          Gặp vấn đề khi đăng nhập?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-xs">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800 mb-1">Lỗi "Email hoặc mật khẩu không đúng"</p>
              <p className="text-red-700 mb-2">Có 2 nguyên nhân chính:</p>
              <ol className="list-decimal list-inside space-y-1 text-red-700">
                <li>Email hoặc mật khẩu bạn nhập không khớp với thông tin đã đăng ký</li>
                <li>Tài khoản chưa được tạo trong hệ thống</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-800">1. Kiểm tra thông tin đăng nhập</p>
              <ul className="text-gray-600 mt-1 space-y-1 ml-4 list-disc">
                <li>Email phải chính xác, không có khoảng trắng thừa</li>
                <li>Mật khẩu phân biệt chữ hoa/thường (tối thiểu 6 ký tự)</li>
                <li>Đảm bảo email và mật khẩu giống khi bạn đăng ký</li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <UserPlus className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-800">2. Chưa có tài khoản?</p>
              <p className="text-gray-600 mt-1">
                Chuyển sang tab <strong>"Đăng ký"</strong> để tạo tài khoản mới. 
                Quá trình đăng ký chỉ mất 30 giây!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Key className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-800">3. Dùng tài khoản test</p>
              <p className="text-gray-600 mt-1 mb-2">
                Nhấn nút <strong>"Dùng tài khoản test"</strong> để tự động điền thông tin và thử nghiệm hệ thống.
              </p>
              <div className="bg-purple-50 border border-purple-200 rounded p-2 text-purple-800 text-xs">
                <p className="font-mono">Email: test@engmastery.com</p>
                <p className="font-mono">Password: test123</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-3 border-t border-orange-200">
          <p className="text-gray-700">
            <strong className="text-orange-700">💡 Gợi ý:</strong> Nếu bạn chắc chắn đã đăng ký nhưng vẫn không đăng nhập được, 
            hãy thử đăng ký lại với cùng email (hệ thống sẽ tự động kiểm tra).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}