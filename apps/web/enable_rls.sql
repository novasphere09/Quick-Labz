DO $$
DECLARE
    row record;
BEGIN
    FOR row IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
    LOOP
        EXECUTE 'ALTER TABLE public."' || row.tablename || '" ENABLE ROW LEVEL SECURITY;';
    END LOOP;
END;
$$;
