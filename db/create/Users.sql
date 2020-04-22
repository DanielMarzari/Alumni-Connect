-- Table: public."Users"

-- DROP TABLE public."Users";

CREATE TABLE public."Users"
(
    "Username" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "Password" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "Permissions" character varying(30) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Users_pkey" PRIMARY KEY ("Username")
)

TABLESPACE pg_default;

ALTER TABLE public."Users"
    OWNER to gejzopxzomezvr;
COMMENT ON TABLE public."Users"
    IS 'Table of alumni and admin users';