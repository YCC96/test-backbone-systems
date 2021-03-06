import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";

import styles from "../../../styles/Home.module.css";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  LinearProgress,
  TextField,
} from "@mui/material";

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

const Contacto: NextPage = (props: any) => {
  const router = useRouter();
  const id = router.query.id;
  const action = router.query.action;
  const [contact, setContact] = useState<any>();
  const [progress, setProgress] = useState(false);
  const [showPage, setShowPage] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: undefined,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setProgress(true);
    if (action === "create") {
      createContact(data);
    }
    if (action === "edit") {
      editContact(data);
    }
    if (action === "delete") {
      deleteContact();
    }
  };

  const getContact = async () => {
    const res = await axios.get(
      `https://bkbnchallenge.herokuapp.com/contacts/${id}`
    );
    const data = await res.data;
    setContact(data);
    setShowPage(true);
  };
  const deleteContact = async () => {
    try {
      const res = await axios.delete(
        `https://bkbnchallenge.herokuapp.com/contacts/${id}`
      );
      await res.data;
      openAlert("Se eliminó con éxito.", "success");
      setTimeout(() => {
        router.push({ pathname: "/" });
      }, 3000);
    } catch (error: any) {
      setProgress(false);
      const message = error?.response?.data?.message
        ? error?.response?.data?.message
        : "Ocurrio un error intente más tarde.";
      openAlert(message, "error");
    }
  };

  const createContact = async (form: any) => {
    try {
      const res = await axios.post(
        `https://bkbnchallenge.herokuapp.com/contacts`,
        form
      );
      await res.data;
      openAlert("Se guardo contacto con éxito.", "success");
      setTimeout(() => {
        router.push({ pathname: "/" });
      }, 3000);
    } catch (error: any) {
      setProgress(false);
      const message = error?.response?.data?.message
        ? error?.response?.data?.message
        : "Ocurrio un error intente más tarde.";
      openAlert(message, "error");
    }
  };

  const editContact = async (form: any) => {
    try {
      const res = await axios.put(
        `https://bkbnchallenge.herokuapp.com/contacts/${id}`,
        form
      );
      await res.data;
      openAlert("Se editó contacto con éxito.", "success");
      setProgress(false);
      setTimeout(() => {
        // router.push({ pathname: "/" });
      }, 2000);
    } catch (error: any) {
      setProgress(false);
      const message = error?.response?.data?.message
        ? error?.response?.data?.message
        : "Ocurrio un error intente más tarde.";
      openAlert(message, "error");
    }
  };

  useEffect(() => {
    if (action && action !== "create") {
      getContact();
    }
    if (action && action === "create") {
      setShowPage(true);
    }
  }, [action]);

  const openAlert = (message: string, severity: any) => {
    setAlert({
      open: true,
      message,
      severity,
    });
    setTimeout(() => {
      setAlert({
        open: false,
        message: "",
        severity: undefined,
      });
    }, 5000);
  };

  const getText = (type: "title" | "button") => {
    let text = "";
    if (type === "title") {
      text =
        action === "create"
          ? "Crear contacto"
          : action === "edit"
          ? "Editar contacto"
          : action === "delete"
          ? "Eliminar contacto"
          : String(action);
    }
    if (type === "button") {
      text =
        action === "create"
          ? "Crear"
          : action === "edit"
          ? "Editar"
          : action === "delete"
          ? "Eliminar"
          : String(action);
    }
    return text;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Contacto</title>
        <meta name="description" content="Generated by Yordy Cruz" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ height: "50px", width: "100%" }}>
        {progress ? <LinearProgress /> : null}
        {alert.open ? (
          <Alert severity={alert.severity}>{alert.message}</Alert>
        ) : null}
      </div>
      <div>
        <h1>{getText("title")}</h1>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          {showPage ? (
            <>
              <div>
                <TextField
                  id="firstName"
                  label="Nombre"
                  defaultValue={contact?.firstName}
                  {...register("firstName", { required: action !== "delete" })}
                  error={!!errors.firstName}
                  helperText={errors.firstName ? "Campo requerido" : ""}
                  variant="standard"
                  disabled={action === "delete"}
                />
                <TextField
                  id="lastName"
                  label="Apellido"
                  defaultValue={contact?.lastName}
                  {...register("lastName", { required: action !== "delete" })}
                  error={!!errors.lastName}
                  helperText={errors.lastName ? "Campo requerido" : ""}
                  variant="standard"
                  disabled={action === "delete"}
                />
              </div>
              <div>
                <TextField
                  id="email"
                  label="Correo electrónico"
                  type="email"
                  defaultValue={contact?.email}
                  {...register("email", {
                    required: {
                      value: action !== "delete",
                      message: "Campo requerido",
                    },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Correo invalido",
                    },
                  })}
                  error={!!errors.email}
                  helperText={
                    errors.email?.message ? errors.email?.message : ""
                  }
                  variant="standard"
                  disabled={action === "delete"}
                />
                <TextField
                  id="phone"
                  label="Número de teléfono"
                  defaultValue={contact?.phone}
                  {...register("phone", {
                    required: {
                      value: action !== "delete",
                      message: "Campo requerido",
                    },
                    maxLength: { value: 10, message: "Solo 10 caracteres" },
                  })}
                  error={!!errors.phone}
                  helperText={
                    errors.phone?.message ? errors.phone?.message : ""
                  }
                  variant="standard"
                  disabled={action === "delete"}
                />
              </div>
            </>
          ) : (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          )}
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            style={{ paddingTop: "50px" }}
          >
            <Grid item>
              <Link href="/">
                <Button variant="contained" color="warning">
                  Regresar
                </Button>
              </Link>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={progress}
              >
                {getText("button")}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </div>
    </div>
  );
};

export default Contacto;
