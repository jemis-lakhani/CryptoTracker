import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { CryptoState } from "../CryptoContext";
import axios from "axios";
import { SingleCoin } from "../config/api";
import {
  Button,
  LinearProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import CoinInfo from "../components/CoinInfo";
import HtmlReactParser from "html-react-parser";
import { numberWithCommas } from "../components/Carousel";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  sidebar: {
    width: "38%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 25,
    borderRight: "2px solid grey",
  },
  heading: {
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Montserrat",
  },
  description: {
    width: "100%",
    fontFamily: "Montserrat",
    padding: 25,
    paddingBottom: 15,
    paddingTop: 0,
    textAlign: "justify",
  },
  marketdata: {
    alignSelf: "start",
    padding: 25,
    paddingTop: 10,
    width: "100%",
    //make it responsive
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },
    [theme.breakpoints.down("xs")]: {
      alignItems: "start",
    },
  },
}));

export default function Coinpage() {
  const classes = useStyles();
  const { id } = useParams();
  const [coin, setcoin] = useState();

  const { currency, symbol, user, watchlist, setalert } = CryptoState();

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setcoin(data);
  };

  useEffect(() => {
    fetchCoin();
  }, []);

  const inwatchlist = watchlist.includes(coin?.id);

  const addtowatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);

    try {
      await setDoc(coinRef, {
        coins: watchlist ? [...watchlist, coin.id] : [coin.id],
      });

      setalert({
        open: true,
        message: `${coin.name} Added to the watchlist`,
        type: "success",
      });
    } catch (error) {
      setalert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  const removefromwatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);

    try {
      await setDoc(
        coinRef,
        { coins: watchlist.filter((watch) => watch !== coin.id) },
        { merge: "true" }
      );

      setalert({
        open: true,
        message: `${coin.name} Removed from watchlist`,
        type: "success",
      });
    } catch (error) {
      setalert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />;

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <img
          src={coin?.image.large}
          alt={coin.name}
          height="200"
          style={{ marginBottom: 20 }}
        />

        <Typography variant="h3" className={classes.heading}>
          {coin.name}
        </Typography>

        <Typography variant="subtitle1" className={classes.description}>
          {HtmlReactParser(coin.description.en.split(". ")[0])}.
        </Typography>

        <div className={classes.marketdata}>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Rank:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {coin.market_cap_rank}
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Current Price:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {symbol}{" "}
              {numberWithCommas(
                coin.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Market Cap:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {symbol}{" "}
              {numberWithCommas(
                coin.market_data.market_cap[currency.toLowerCase()].toString()
              )}
            </Typography>
          </span>

          {user && (
            <Button
              variant="outlined"
              style={{
                width: "100%",
                height: 40,
                backgroundColor: inwatchlist ? "#FF0000" : "#EEBC1D",
              }}
              onClick={inwatchlist ? removefromwatchlist : addtowatchlist}
            >
              {inwatchlist ? "Remove from watchlist" : "Add to Watchlist"}
            </Button>
          )}
        </div>
      </div>

      {/* chart */}
      <CoinInfo coin={coin} />
    </div>
  );
}
