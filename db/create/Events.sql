-- Table: public."Events"

-- DROP TABLE public."Events";

CREATE TABLE public."Events"
(
    "ID" integer NOT NULL DEFAULT nextval('"Test_ID_seq"'::regclass),
    "Color" character varying(10) COLLATE pg_catalog."default" NOT NULL,
    "Contact" character varying(50) COLLATE pg_catalog."default" NOT NULL,
    "Coordinator" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "Cost" integer NOT NULL,
    "Date_Time" date NOT NULL,
    "Description" text COLLATE pg_catalog."default" NOT NULL,
    "DurationH" integer,
    "DurationD" integer,
    "Invitees" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "Location" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "Name" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Test_pkey" PRIMARY KEY ("ID")
)

TABLESPACE pg_default;

ALTER TABLE public."Events"
    OWNER to gejzopxzomezvr;
COMMENT ON TABLE public."Events"
    IS 'Table for university Events';