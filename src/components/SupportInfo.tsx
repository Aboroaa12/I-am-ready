import React from 'react';
import { MessageSquare, Phone, Mail, HelpCircle } from 'lucide-react';

interface SupportInfoProps {
  whatsappNumber?: string;
  email?: string;
  showHeader?: boolean;
  className?: string;
}

const SupportInfo: React.FC<SupportInfoProps> = ({
  whatsappNumber = '+96895585810',
  email = 'support@example.com',
  showHeader = true,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      {showHeader && (
        <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-4">
          <HelpCircle className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">هل تحتاج مساعدة؟</h3>
        </div>
      )}
      
      <p className="text-gray-700 mb-4">
        للدعم الفني والمساعدة، يرجى التواصل مع مشرف التطبيق عبر إحدى الطرق التالية:
      </p>
      
      <div className="space-y-3">
        {whatsappNumber && (
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">WhatsApp</div>
              <a 
                href={`https://wa.me/${whatsappNumber.replace(/\+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 font-semibold transition-colors"
              >
                {whatsappNumber}
              </a>
            </div>
          </div>
        )}
        
        {email && (
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">البريد الإلكتروني</div>
              <a 
                href={`mailto:${email}`}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                {email}
              </a>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center text-gray-600 text-sm">
        نحن هنا لمساعدتك في أي استفسار أو مشكلة تواجهك.
      </div>
    </div>
  );
};

export default SupportInfo;