import React, { useEffect, useState } from "react";
//MUI AStuff
import { Grid } from "@material-ui/core";
import Scard from "../components/Scard";
import { useRedux } from "../redux/Redux";
import Profile from "../components/Profile";
import {
  getAllStream,
  getlikeStream,
  getNotification,
} from "../components/apiCalls";
import Comment from "../components/Comment";

function Home() {
  const [error, setError] = useState();
  const [{ user, loading, stream, token, expired }, dispatch] = useRedux();
  useEffect(() => {
    getAllStream(token)
      .then((res) => {
        dispatch({ type: "Get stream", value: res.data });
      })
      .catch((err) => {
        console.log(err.response?.data);
        setError(err.response?.data);
      });

    getlikeStream(token)
      .then((res) => dispatch({ type: "Like stream", value: res.data }))
      .catch((err) => console.log(err.response?.data));

    getNotification(token)
      .then((res) => dispatch({ type: "notifications", value: res.data }))
      .catch((err) => console.log(err.response?.data));
  }, []);

  return (
    <>
      <Comment />
      <Grid container spaceing={16}>
        <Grid item sm={8} xs={12}>
          {stream ? (
            stream?.map((item) => (
              <Scard
                key={item._id}
                userHandle={item.userHandle}
                id={item._id}
                imageUrl={item.imageUrl}
                body={item.body}
                createdAt={item.createdAt}
                likeCount={item.likeCount}
                commentCount={item.commentCount}
              />
            ))
          ) : (
            <>{error ? <p>{error.error}</p> : <p>loading</p>}</>
          )}
        </Grid>
        {!error && (
          <Grid item sm={4} xs={12}>
            {!loading ? (
              <>
                {" "}
                {user.credentials?.map((item) => (
                  <Profile
                    key={item._id}
                    location={item.location}
                    userHandle={item.userHandle}
                    bio={item.bio}
                    website={item.website}
                    createdAt={item.createdAt}
                    image={item.imageUrl}
                  />
                ))}
              </>
            ) : (
              <p>loading...</p>
            )}
          </Grid>
        )}
      </Grid>
    </>
  );
}

export default Home;
