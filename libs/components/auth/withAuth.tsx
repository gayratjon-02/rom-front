import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '@/libs/server/HomePage/signup';

/**
 * 🔒 Higher-Order Component (HOC) for protecting pages
 * Agar user login qilmagan bo'lsa, signup page ga redirect qiladi
 *
 * Usage:
 * export default withAuth(MyPage);
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const WithAuthComponent = (props: P) => {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthed, setIsAuthed] = useState(false);

    useEffect(() => {
      // Authentication check
      const checkAuth = () => {
        const authed = isAuthenticated();

        if (!authed) {
          // Token yo'q - signup page ga redirect
          // Current path ni saqlash (login qilgandan keyin qaytish uchun)
          router.replace({
            pathname: '/signup',
            query: { redirect: router.asPath },
          });
        } else {
          setIsAuthed(true);
        }

        setIsChecking(false);
      };

      checkAuth();
    }, [router]);

    // Loading state - authentication tekshirilayotgan vaqt
    if (isChecking) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: '#0a0a0f',
            color: '#fff',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '50px',
                height: '50px',
                border: '4px solid rgba(255, 255, 255, 0.1)',
                borderTop: '4px solid #4f46e5',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px',
              }}
            />
            <p>Loading...</p>
          </div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    }

    // Authenticated - render actual component
    if (!isAuthed) {
      return null; // Redirect qilinmoqda
    }

    return <WrappedComponent {...props} />;
  };

  // Display name for debugging
  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
}
