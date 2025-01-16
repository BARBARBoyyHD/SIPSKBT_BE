const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = 'https://moajgnrggweminorvbeh.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey,supabaseServiceRole)

module.exports = supabase