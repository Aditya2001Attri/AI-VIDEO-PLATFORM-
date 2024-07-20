import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { getUser } from '@/lib/supabase/getUser';
import { supabase } from '@/lib/supabaseClient';

import { useUser } from '@/contexts';

import Loader from '~/svg/Loader.svg';

const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const { setUser, user } = useUser();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const checkUser = async () => {
        try {
          const currentUser = await supabase.auth.getUser();

          if (
            !currentUser ||
            currentUser.error ||
            !currentUser.data ||
            !currentUser.data.user ||
            !currentUser.data.user.id
          ) {
            router.replace('/login'); // Redirect to login if not authenticated
          } else {
            const newUserData = await getUser(
              currentUser.data.user.id,
              currentUser.data.user.email
            );
            setUser(newUserData);

            setLoading(false);
          }
        } catch (error) {
          router.replace('/login'); // Redirect to login if not authenticated
        }
      };

      checkUser();
    }, [router, setUser]);

    if (loading) {
      return (
        <div className='flex h-screen flex-col items-center justify-center'>
          <Loader className='h-6 w-6 animate-spin text-gray-700 duration-100' />
        </div>
      );
    }

    return user ? <WrappedComponent {...props} /> : null; // Render the wrapped component only if authenticated
  };
};

export default withAuth;
