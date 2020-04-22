-- Table: public."WorkHistory"

-- DROP TABLE public."WorkHistory";

CREATE TABLE public."WorkHistory"
(
    "ID" integer NOT NULL DEFAULT nextval('"WorkHistory_ID_seq"'::regclass),
    "Company" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "Title" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "Part_FullTime" character varying(20) COLLATE pg_catalog."default" NOT NULL,
    "StartDate" date NOT NULL,
    "EndDate" date,
    "Description" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "Alumni_ID" integer NOT NULL,
    CONSTRAINT "WorkHistory_pkey" PRIMARY KEY ("ID"),
    CONSTRAINT fk_alumni FOREIGN KEY ("Alumni_ID")
        REFERENCES public."Alumni" ("ID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public."WorkHistory"
    OWNER to gejzopxzomezvr;
COMMENT ON TABLE public."WorkHistory"
    IS 'Table for work history';

COMMENT ON CONSTRAINT fk_alumni ON public."WorkHistory"
    IS 'connects work history to alumni';