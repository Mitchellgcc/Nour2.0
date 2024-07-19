--
-- PostgreSQL database dump
--

-- Dumped from database version 14.12 (Homebrew)
-- Dumped by pg_dump version 14.12 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: FoodInventory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FoodInventory" (
    id integer NOT NULL,
    user_id integer NOT NULL,
    item_name character varying(255) NOT NULL,
    quantity integer NOT NULL,
    expiration_date timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: FoodInventory_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."FoodInventory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: FoodInventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."FoodInventory_id_seq" OWNED BY public."FoodInventory".id;


--
-- Name: HealthMetrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."HealthMetrics" (
    id integer NOT NULL,
    user_id integer NOT NULL,
    metric_type character varying(255) NOT NULL,
    value double precision NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: HealthMetrics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."HealthMetrics_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: HealthMetrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."HealthMetrics_id_seq" OWNED BY public."HealthMetrics".id;


--
-- Name: InventoryItems; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."InventoryItems" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    quantity integer NOT NULL,
    "expirationDate" timestamp with time zone,
    "userId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: LocalFoodOptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LocalFoodOptions" (
    id integer NOT NULL,
    user_id integer NOT NULL,
    restaurant_name character varying(255) NOT NULL,
    food_item character varying(255) NOT NULL,
    price double precision NOT NULL,
    nutrition_info json NOT NULL,
    rating double precision NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: LocalFoodOptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."LocalFoodOptions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: LocalFoodOptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."LocalFoodOptions_id_seq" OWNED BY public."LocalFoodOptions".id;


--
-- Name: MealPlans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MealPlans" (
    id integer NOT NULL,
    user_id integer NOT NULL,
    meal_type character varying(255) NOT NULL,
    date timestamp with time zone NOT NULL,
    meal_details json NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: MealPlans_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."MealPlans_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: MealPlans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."MealPlans_id_seq" OWNED BY public."MealPlans".id;


--
-- Name: Meals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Meals" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    calories double precision NOT NULL,
    protein double precision NOT NULL,
    carbs double precision NOT NULL,
    fat double precision NOT NULL,
    micronutrients json,
    vitamins json,
    minerals json,
    "glycemicIndex" double precision,
    "glycemicLoad" double precision,
    "waterContent" double precision,
    omega3 double precision,
    omega6 double precision,
    polyphenols double precision,
    antioxidants double precision,
    "solubleFiber" double precision,
    "insolubleFiber" double precision,
    sodium double precision,
    cholesterol double precision,
    fiber double precision,
    sugar double precision,
    "aminoAcids" json,
    "fattyAcids" json,
    "nutrientDensityScore" double precision,
    "healthImpactScore" double precision,
    "inflammationScore" double precision,
    "oxidativeStressScore" double precision,
    "microbiomeImpactScore" double precision,
    "userId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


--
-- Name: Sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Sessions" (
    sid character varying(36) NOT NULL,
    expires timestamp with time zone,
    data text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Users" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "whoopId" character varying(255),
    "whoopAccessToken" character varying(255),
    "whoopRefreshToken" character varying(255),
    "whoopTokenExpires" timestamp with time zone,
    "sessionId" character varying(255),
    "dietaryPreferences" json,
    feedback json,
    "overallHealthScore" double precision,
    "healthTrend" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Users_backup; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Users_backup" (
    id integer,
    name character varying(255),
    email character varying(255),
    password character varying(255),
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    "whoopId" character varying(255),
    "whoopAccessToken" character varying(255),
    "whoopRefreshToken" character varying(255),
    "whoopTokenExpires" timestamp with time zone
);


--
-- Name: WearableData; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."WearableData" (
    id integer NOT NULL,
    user_id integer NOT NULL,
    device_type character varying(255) NOT NULL,
    data_type character varying(255) NOT NULL,
    value double precision NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: WearableData_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."WearableData_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: WearableData_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."WearableData_id_seq" OWNED BY public."WearableData".id;


--
-- Name: WhoopData; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."WhoopData" (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    profile jsonb,
    cycles jsonb,
    recoveries jsonb,
    "sleepData" jsonb,
    workouts jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: FoodInventory id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FoodInventory" ALTER COLUMN id SET DEFAULT nextval('public."FoodInventory_id_seq"'::regclass);


--
-- Name: HealthMetrics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HealthMetrics" ALTER COLUMN id SET DEFAULT nextval('public."HealthMetrics_id_seq"'::regclass);


--
-- Name: LocalFoodOptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LocalFoodOptions" ALTER COLUMN id SET DEFAULT nextval('public."LocalFoodOptions_id_seq"'::regclass);


--
-- Name: MealPlans id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MealPlans" ALTER COLUMN id SET DEFAULT nextval('public."MealPlans_id_seq"'::regclass);


--
-- Name: WearableData id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WearableData" ALTER COLUMN id SET DEFAULT nextval('public."WearableData_id_seq"'::regclass);


--
-- Name: FoodInventory FoodInventory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FoodInventory"
    ADD CONSTRAINT "FoodInventory_pkey" PRIMARY KEY (id);


--
-- Name: HealthMetrics HealthMetrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HealthMetrics"
    ADD CONSTRAINT "HealthMetrics_pkey" PRIMARY KEY (id);


--
-- Name: InventoryItems InventoryItems_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InventoryItems"
    ADD CONSTRAINT "InventoryItems_pkey" PRIMARY KEY (id);


--
-- Name: LocalFoodOptions LocalFoodOptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LocalFoodOptions"
    ADD CONSTRAINT "LocalFoodOptions_pkey" PRIMARY KEY (id);


--
-- Name: MealPlans MealPlans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MealPlans"
    ADD CONSTRAINT "MealPlans_pkey" PRIMARY KEY (id);


--
-- Name: Meals Meals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Meals"
    ADD CONSTRAINT "Meals_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: Sessions Sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Sessions"
    ADD CONSTRAINT "Sessions_pkey" PRIMARY KEY (sid);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: WearableData WearableData_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WearableData"
    ADD CONSTRAINT "WearableData_pkey" PRIMARY KEY (id);


--
-- Name: WhoopData WhoopData_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WhoopData"
    ADD CONSTRAINT "WhoopData_pkey" PRIMARY KEY (id);


--
-- Name: TABLE "FoodInventory"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public."FoodInventory" TO mitchellgcc;


--
-- Name: SEQUENCE "FoodInventory_id_seq"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public."FoodInventory_id_seq" TO mitchellgcc;


--
-- Name: TABLE "HealthMetrics"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public."HealthMetrics" TO mitchellgcc;


--
-- Name: SEQUENCE "HealthMetrics_id_seq"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public."HealthMetrics_id_seq" TO mitchellgcc;


--
-- Name: TABLE "LocalFoodOptions"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public."LocalFoodOptions" TO mitchellgcc;


--
-- Name: SEQUENCE "LocalFoodOptions_id_seq"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public."LocalFoodOptions_id_seq" TO mitchellgcc;


--
-- Name: TABLE "MealPlans"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public."MealPlans" TO mitchellgcc;


--
-- Name: SEQUENCE "MealPlans_id_seq"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public."MealPlans_id_seq" TO mitchellgcc;


--
-- Name: TABLE "SequelizeMeta"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public."SequelizeMeta" TO mitchellgcc;


--
-- Name: TABLE "WearableData"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public."WearableData" TO mitchellgcc;


--
-- Name: SEQUENCE "WearableData_id_seq"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public."WearableData_id_seq" TO mitchellgcc;


--
-- PostgreSQL database dump complete
--

