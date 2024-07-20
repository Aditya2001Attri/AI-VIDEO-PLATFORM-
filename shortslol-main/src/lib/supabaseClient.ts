import { Database } from '@shortslol/common';
import { createClient } from '@supabase/supabase-js';

import getClientConfig from './config/clientConfig';

const { supabaseApiKey, supabaseUrl } = getClientConfig();

export const supabase = createClient<Database>(supabaseUrl, supabaseApiKey);
