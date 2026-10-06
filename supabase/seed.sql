-- EXPENSEFLOW DEMO SEED DATA
-- Replace 'YOUR_USER_UUID_HERE' with your actual Supabase auth user UUID

DO $$
DECLARE
  target_user_id UUID := 'YOUR_USER_UUID_HERE'; -- Replace with your auth.users id
BEGIN
  -- Check if user exists
  IF target_user_id != 'YOUR_USER_UUID_HERE' THEN
    -- Insert demo profile if not exists
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (target_user_id, 'Demo User', 'demo@expenseflow.app')
    ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

    -- Insert Monthly Budget (current month & year)
    INSERT INTO public.budgets (user_id, month, year, amount)
    VALUES (
      target_user_id,
      EXTRACT(MONTH FROM CURRENT_DATE)::INT,
      EXTRACT(YEAR FROM CURRENT_DATE)::INT,
      15000.00
    )
    ON CONFLICT (user_id, month, year) DO UPDATE SET amount = EXCLUDED.amount;

    -- Insert Demo Income
    INSERT INTO public.transactions (user_id, type, amount, category, description, transaction_date)
    VALUES 
      (target_user_id, 'income', 30000.00, 'Salary', 'Monthly Tech Lead Salary', CURRENT_DATE - INTERVAL '5 days'),
      (target_user_id, 'income', 8500.00, 'Freelance', 'UI/UX Design Consultation', CURRENT_DATE - INTERVAL '12 days');

    -- Insert Demo Expenses
    INSERT INTO public.transactions (user_id, type, amount, category, description, transaction_date)
    VALUES 
      (target_user_id, 'expense', 2500.00, 'Food', 'Grocery supermarket restock', CURRENT_DATE - INTERVAL '2 days'),
      (target_user_id, 'expense', 1500.00, 'Transport', 'Metro card recharge & fuel', CURRENT_DATE - INTERVAL '4 days'),
      (target_user_id, 'expense', 2000.00, 'Shopping', 'Noise-cancelling headphones', CURRENT_DATE - INTERVAL '7 days'),
      (target_user_id, 'expense', 3000.00, 'Bills', 'High-speed broadband & electricity', CURRENT_DATE - INTERVAL '10 days'),
      (target_user_id, 'expense', 950.00, 'Entertainment', 'Weekend movie & snacks', CURRENT_DATE - INTERVAL '3 days');

    RAISE NOTICE 'Seed data successfully inserted for user %', target_user_id;
  ELSE
    RAISE NOTICE 'Please update target_user_id with your real Supabase user UUID before running seed.';
  END IF;
END $$;
