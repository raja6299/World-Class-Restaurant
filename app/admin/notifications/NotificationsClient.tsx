'use client';

import React, { useEffect, useState } from 'react';
import { markNotificationAsReadAction } from '@/src/modules/notifications/actions';
import { CheckCircle2, Circle, Bell, AlertTriangle, Package, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { NotificationDto } from '@/src/modules/notifications/dto';
import { createClient } from '@/src/lib/supabase/client';
import { toast } from 'react-hot-toast';

interface NotificationsClientProps {
  initialData: NotificationDto[];
}

export default function NotificationsClient({ initialData }: NotificationsClientProps) {
  const [notifications, setNotifications] = useState<NotificationDto[]>(initialData);

  useEffect(() => {
    const supabase = createClient();
    
    // Subscribe to new notifications
    const channel = supabase
      .channel('public:Notification')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Notification' },
        (payload) => {
          const newNotif = payload.new as NotificationDto;
          setNotifications(prev => [newNotif, ...prev]);
          toast.success(`New Notification: ${newNotif.message}`);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'Notification' },
        (payload) => {
          const updatedNotif = payload.new as NotificationDto;
          setNotifications(prev => prev.map(n => n.id === updatedNotif.id ? updatedNotif : n));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleMarkRead = async (id: string) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    await markNotificationAsReadAction(id);
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'ORDER_CREATED': return <Bell className="w-5 h-5 text-blue-500" />;
      case 'INVENTORY_ALERT': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'PO_RECEIVED': return <Package className="w-5 h-5 text-green-500" />;
      case 'RESERVATION_NEW': return <Calendar className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-aurum-gold-primary" />;
    }
  };

  return (
    <div className="bg-aurum-cream-secondary border border-aurum-gold-primary/10 rounded-xl overflow-hidden">
      {notifications.length === 0 ? (
        <div className="p-8 text-center text-aurum-text-body/60">
          <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>No notifications yet.</p>
        </div>
      ) : (
        <ul className="divide-y divide-aurum-gold-primary/10">
          {notifications.map((notif) => (
            <li key={notif.id} className={`p-4 flex gap-4 transition-colors ${notif.isRead ? 'bg-white opacity-70' : 'bg-aurum-cream-primary'}`}>
              <div className="pt-1">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${notif.isRead ? 'text-aurum-text-body' : 'font-medium text-aurum-text-heading'}`}>
                  {notif.message}
                </p>
                <p className="text-xs text-aurum-text-body/60 mt-1">
                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                </p>
              </div>
              <div className="pl-4 flex items-center">
                {!notif.isRead ? (
                  <button onClick={() => handleMarkRead(notif.id)} className="text-aurum-text-body/40 hover:text-green-500 transition-colors" title="Mark as read">
                    <Circle className="w-6 h-6" />
                  </button>
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-green-500/50" />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
