import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { checkSupabaseConnection } from '../lib/supabase';

interface SupabaseConnectionStatusProps {
  className?: string;
}

const SupabaseConnectionStatus: React.FC<SupabaseConnectionStatusProps> = ({ className = '' }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    checkConnection();
    
    // التحقق من الاتصال كل دقيقة
    const interval = setInterval(checkConnection, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    setIsChecking(true);
    const connected = await checkSupabaseConnection();
    setIsConnected(connected);
    setLastChecked(new Date());
    setIsChecking(false);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isConnected ? (
        <div className="flex items-center gap-2 text-green-600">
          <Wifi className="w-4 h-4" />
          <span className="text-xs">متصل بقاعدة البيانات</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-red-600">
          <WifiOff className="w-4 h-4" />
          <span className="text-xs">غير متصل</span>
        </div>
      )}
      
      <button
        onClick={checkConnection}
        disabled={isChecking}
        className="text-gray-500 hover:text-gray-700 disabled:text-gray-300"
        title="تحديث حالة الاتصال"
      >
        <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
      </button>
      
      {lastChecked && (
        <span className="text-xs text-gray-500">
          {lastChecked.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default SupabaseConnectionStatus;