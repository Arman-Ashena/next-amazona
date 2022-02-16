import axios from "axios";
import dynamic from "next/dynamic";
import { Router, useRouter } from "next/router";
import React, { useContext, useReducer, useEffect } from "react";
import { Store } from "../../../utils/store";
import { getError } from "../../../utils/error";
import Layout from "../../../components/Layout";
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@material-ui/core";
import useStyle from "../../../utils/styles";
import NextLink from "next/link";
import { Controller, useForm } from "react-hook-form";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return {
        ...state,
        loading: true,
        error: "",
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        product: action.payload,
        loading: false,
        error: "",
      };
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "UPDATE_REQUEST":
      return {
        ...state,
        loadingUpdate: true,
        errorUpdate: "",
      };
    case "UPDATE_SUCCESS":
      return {
        ...state,
        loadingUpdate: false,
        errorUpdate: "",
      };
    case "UPDATE_FAIL":
      return {
        ...state,
        loadingUpdate: false,
        errorUpdate: action.payload,
      };
    case "UPLOAD_REQUEST":
      return {
        ...state,
        loadingUpload: true,
        errorUpload: "",
      };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: action.payload,
      };
    default:
      state;
  }
};

function ProductEdit({ params }) {
  const productId = params.id;
  const { state } = useContext(Store);
  const { userInfo } = state;
  const router = useRouter();
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: false,
      error: "",
    });

  useEffect(() => {
    if (!userInfo) {
      Router.push("/login");
    }
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/products/${productId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS" });
        setValue("name", data.name);
        setValue("slug", data.slug);
        setValue("price", data.price);
        setValue("image", data.image);
        setValue("category", data.category);
        setValue("brand", data.brand);
        setValue("count", data.count);
        setValue("description", data.description);
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", error: getError(error) });
      }
    };
    fetchData();
  }, []);
  const classes = useStyle();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const uploadHandler = async (e) => {
    const file = e.target.files[0];
    const bodyformData = new FormData();
    bodyformData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(`/api/admin/upload`, bodyformData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      setValue("image", data.secure_url);
      alert("image uploaded successfuly");
    } catch (error) {
      // for (key in error.response.data) {
      //   if (data.hasOwnProperty(key)) {
      //     var value = data[key];
      //     console.log("qq", value);
      //   }
      // }
      console.log("qq", error.response);
      dispatch({ type: "UPLOAD_FAIL" });
      alert("upload failed");
    }
  };
  const submitHandler = async ({
    name,
    count,
    slug,
    price,
    category,
    rating,
    image,
    brand,
    description,
  }) => {
    try {
      dispatch({ type: "UPDATE_REQUEST" });

      await axios.put(
        `/api/admin/products/${productId}`,
        {
          name,
          count,
          slug,
          price,
          category,
          rating,
          image,
          brand,
          description,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      alert("Product Updated Successfully");
      router.push("/admin/products");
    } catch (error) {
      getError(error);
      console.log(getError(error));
      dispatch({ type: "UPDATE_FAIL", payload: getError(error) });
    }
  };

  return (
    <>
      <Layout title={`Update Product ${productId}`}>
        <Grid container spacing={1}>
          <Grid item md={3} xs={12}>
            <Card className={classes.section}>
              <List>
                <NextLink href="/admin/dashboard" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Admin Dashboard"></ListItemText>
                  </ListItem>
                </NextLink>
                <NextLink href="/admin/orders" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Orders"></ListItemText>
                  </ListItem>
                </NextLink>
                <NextLink href="/admin/products" passHref>
                  <ListItem selected button component="a">
                    <ListItemText primary="Products"></ListItemText>
                  </ListItem>
                </NextLink>
                <NextLink href="/admin/users" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Users"></ListItemText>
                  </ListItem>
                </NextLink>
              </List>
            </Card>
          </Grid>
          <Grid item md={9} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h1" variant="h1">
                    Edit Product {productId}
                  </Typography>
                </ListItem>
                <ListItem>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    error && (
                      <Typography className={classes.error}>{error}</Typography>
                    )
                  )}
                </ListItem>
                <ListItem>
                  <form
                    onSubmit={handleSubmit(submitHandler)}
                    className={classes.form}
                  >
                    <List>
                      <ListItem>
                        <Controller
                          name="name"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="name"
                              label="name"
                              error={Boolean(errors.name)}
                              helperText={errors.name ? "Name is Rquired" : ""}
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="slug"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="slug"
                              label="Slug"
                              error={Boolean(errors.slug)}
                              helperText={errors.slug ? "Slug is Rquired" : ""}
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="price"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="price"
                              label="Price"
                              error={Boolean(errors.price)}
                              helperText={
                                errors.price ? "Price is Rquired" : ""
                              }
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="image"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="image"
                              label="Image"
                              error={Boolean(errors.image)}
                              helperText={
                                errors.image ? "Image is Rquired" : ""
                              }
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem>
                        <Button component="label" variant="contained">
                          Upload File
                          <input type="file" hidden onChange={uploadHandler} />
                        </Button>
                        {loadingUpload && <CircularProgress />}
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="category"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="category"
                              label="Category"
                              error={Boolean(errors.category)}
                              helperText={
                                errors.category ? "Category is Rquired" : ""
                              }
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>{" "}
                      <ListItem>
                        <Controller
                          name="brand"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="brand"
                              label="Brand"
                              error={Boolean(errors.brand)}
                              helperText={
                                errors.brand ? "Brand is Rquired" : ""
                              }
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>{" "}
                      <ListItem>
                        <Controller
                          name="count"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="count"
                              label="Count"
                              error={Boolean(errors.count)}
                              helperText={
                                errors.count ? "Count is Rquired" : ""
                              }
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="description"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              multiline
                              id="description"
                              label="Description"
                              error={Boolean(errors.description)}
                              helperText={
                                errors.description
                                  ? "Description is Rquired"
                                  : ""
                              }
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          fullWidth
                        >
                          Update
                        </Button>
                        {loadingUpdate && <CircularProgress></CircularProgress>}
                      </ListItem>
                    </List>
                  </form>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });
