import {
  PopulatedUser,
  SUBSCRIPTIONS_TABLE,
  USERS_TABLE,
} from '@shortslol/common';

import { supabase } from '../supabaseClient';

export const getUser = async (
  userId: string,
  email?: string
): Promise<PopulatedUser> => {
  const { data: userData, error: userError } = await supabase
    .from(USERS_TABLE)
    .select('*')
    .eq('id', userId)
    .single();

  if (userError || !userData) {
    console.error('Error fetching user:', userError);
    throw new Error('User not found');
  }

  const populatedUser: PopulatedUser = userData;

  console.log('User data:', userData);

  // Fetch the most recent subscription
  const { data: subscriptionData, error: subscriptionError } = await supabase
    .from(SUBSCRIPTIONS_TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false })
    .limit(1);

  if (subscriptionError) {
    console.error('Error fetching subscription:', subscriptionError);
  }

  if (email) {
    populatedUser.email = email;
  }

  if (subscriptionData && subscriptionData.length > 0) {
    populatedUser.subscription = subscriptionData[0];
  }

  return populatedUser;
};
