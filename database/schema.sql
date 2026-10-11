-- School OS PostgreSQL Core Schema
-- Extracted from DB.sql

CREATE TABLE IF NOT EXISTS school_profile (
    id bigint NOT NULL PRIMARY KEY,
    name character varying(200) NOT NULL,
    affiliation_number character varying(100) NOT NULL,
    phone character varying(20) NOT NULL,
    email character varying(254) NOT NULL,
    address text NOT NULL,
    logo character varying(100),
    website character varying(200) NOT NULL,
    established_year character varying(10) NOT NULL,
    principal_name character varying(200) NOT NULL,
    school_code character varying(100) NOT NULL,
    period_times jsonb NOT NULL,
    affiliation_renewed_upto date,
    block_debug_builds boolean NOT NULL DEFAULT false,
    block_developer_options boolean NOT NULL DEFAULT false,
    block_emulator boolean NOT NULL DEFAULT false,
    block_usb_debugging boolean NOT NULL DEFAULT false,
    lat numeric(9,6),
    lng numeric(9,6),
    max_location_accuracy_meters integer NOT NULL DEFAULT 50,
    max_location_age_seconds integer NOT NULL DEFAULT 60,
    radius_meters integer NOT NULL DEFAULT 100,
    require_native_attendance_app boolean NOT NULL DEFAULT false,
    attendance_zones jsonb NOT NULL DEFAULT '[]'::jsonb,
    student_attendance_deadline time without time zone
);

CREATE TABLE IF NOT EXISTS "user" (
    id bigint NOT NULL PRIMARY KEY,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL DEFAULT false,
    username character varying(150) NOT NULL UNIQUE,
    first_name character varying(150) NOT NULL,
    last_name character varying(150) NOT NULL,
    email character varying(254) NOT NULL,
    is_staff boolean NOT NULL DEFAULT false,
    is_active boolean NOT NULL DEFAULT true,
    date_joined timestamp with time zone NOT NULL,
    role character varying(20) NOT NULL,
    avatar character varying(100),
    is_staff_portal boolean NOT NULL DEFAULT false,
    access_role_id bigint
);

CREATE TABLE IF NOT EXISTS academic_year (
    id bigint NOT NULL PRIMARY KEY,
    name character varying(20) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    is_active boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS student (
    id bigint NOT NULL PRIMARY KEY,
    name character varying(200) NOT NULL,
    class_assigned character varying(20) NOT NULL,
    section character varying(100) NOT NULL,
    house character varying(50) NOT NULL,
    stream character varying(100) NOT NULL,
    optional_subject character varying(100) NOT NULL,
    additional_subject character varying(100) NOT NULL,
    roll character varying(20) NOT NULL,
    admission_no character varying(50),
    admission_date date,
    status character varying(20) NOT NULL,
    dob date,
    gender character varying(10) NOT NULL,
    blood_group character varying(5) NOT NULL,
    religion character varying(50) NOT NULL,
    category character varying(50) NOT NULL,
    aadhar_number character varying(20) NOT NULL,
    single_girl_child boolean NOT NULL DEFAULT false,
    specially_abled boolean NOT NULL DEFAULT false,
    ews boolean NOT NULL DEFAULT false,
    address text NOT NULL,
    residential_address text NOT NULL,
    email character varying(254),
    parent character varying(200) NOT NULL,
    father_name character varying(200) NOT NULL DEFAULT '',
    father_phone character varying(20) NOT NULL DEFAULT '',
    father_occupation character varying(100) NOT NULL DEFAULT '',
    mother_name character varying(200) NOT NULL DEFAULT '',
    mother_phone character varying(20) NOT NULL DEFAULT '',
    mother_occupation character varying(100) NOT NULL DEFAULT '',
    photo character varying(100),
    academic_year_id bigint REFERENCES academic_year(id),
    fee_category_id bigint,
    spen_number character varying(50) NOT NULL DEFAULT '',
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS student_session_enrollment (
    id bigint NOT NULL PRIMARY KEY,
    sr_no integer NOT NULL,
    class_name character varying(20) NOT NULL,
    section character varying(100) NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    deactivation_reason character varying(20) NOT NULL DEFAULT '',
    deactivated_at date,
    academic_year_id bigint NOT NULL REFERENCES academic_year(id),
    student_id bigint NOT NULL REFERENCES student(id),
    promotion_status character varying(20) NOT NULL DEFAULT '',
    promotion_exam_name character varying(100) NOT NULL DEFAULT '',
    promotion_pass_percent numeric(5,2),
    student_type character varying(10) NOT NULL DEFAULT 'regular',
    created_at timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS invoice (
    id bigint NOT NULL PRIMARY KEY,
    total numeric(10,2) NOT NULL,
    paid numeric(10,2) NOT NULL DEFAULT 0.00,
    due_date date,
    status character varying(20) NOT NULL,
    fee_components jsonb NOT NULL DEFAULT '{}'::jsonb,
    month integer,
    year integer,
    academic_year_id bigint REFERENCES academic_year(id),
    student_id bigint NOT NULL REFERENCES student(id),
    created_by_id bigint REFERENCES "user"(id),
    created_at timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS payment (
    id bigint NOT NULL PRIMARY KEY,
    amount numeric(10,2) NOT NULL,
    discount_amount numeric(10,2) NOT NULL DEFAULT 0.00,
    discount_reason character varying(255) NOT NULL DEFAULT '',
    mode character varying(20) NOT NULL,
    transaction_id character varying(100) NOT NULL DEFAULT '',
    remarks text NOT NULL DEFAULT '',
    date timestamp with time zone NOT NULL,
    invoice_id bigint NOT NULL REFERENCES invoice(id),
    collected_by_id bigint REFERENCES "user"(id)
);

CREATE TABLE IF NOT EXISTS advance_payment (
    id bigint NOT NULL PRIMARY KEY,
    amount numeric(10,2) NOT NULL,
    balance numeric(10,2) NOT NULL,
    source character varying(30) NOT NULL,
    reference_note character varying(200) NOT NULL DEFAULT '',
    created_at timestamp with time zone NOT NULL,
    student_id bigint NOT NULL REFERENCES student(id),
    collected_by_id bigint REFERENCES "user"(id)
);
