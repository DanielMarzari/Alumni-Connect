-- Table: public."Alumni"

-- DROP TABLE public."Alumni";

CREATE TABLE public."Alumni"
(
    "ID" integer NOT NULL DEFAULT nextval('"Alumni_ID_seq"'::regclass),
    "FullName" character varying(150) COLLATE pg_catalog."default" NOT NULL,
    "Gender" character varying(20) COLLATE pg_catalog."default" NOT NULL,
    "Birthday" date NOT NULL,
    "Phone" character varying(30) COLLATE pg_catalog."default",
    "Email" character varying(100) COLLATE pg_catalog."default",
    "Degree" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "Website" character varying(255) COLLATE pg_catalog."default",
    "LinkedInURL" character varying(255) COLLATE pg_catalog."default",
    "Bio" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "GraduationYear" integer NOT NULL,
    "PictureURL" character varying(255) COLLATE pg_catalog."default",
    "User_ID" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Alumni_pkey" PRIMARY KEY ("ID"),
    CONSTRAINT fk_users FOREIGN KEY ("User_ID")
        REFERENCES public."Users" ("Username") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public."Alumni"
    OWNER to gejzopxzomezvr;
COMMENT ON TABLE public."Alumni"
    IS 'Table for Alumni profile data';