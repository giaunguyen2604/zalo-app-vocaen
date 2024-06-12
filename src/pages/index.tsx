import React, { Suspense, useEffect, useState } from "react"
import {  Page, useNavigate, useSnackbar } from "zmp-ui";
import UserCard from "components/user-card";
import Papa from 'papaparse';
import { CSVRow } from "interfaces/app";

const DATA_URL="https://docs.google.com/spreadsheets/d/e/2PACX-1vTYOz6-NUSu6cKmSdiGumlCs0sgfPnaipbnnQwWEFTQAqOHGFPojbLPFrm91fS44vNUpR2jhk0iXuau/pub?output=csv"
const HomePage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const [vocabs, setVocabs] = useState<CSVRow[]>([])

  useEffect(() => {
    Papa.parse<CSVRow>(DATA_URL, {
      download: true,
      header: true,

      complete: results => {
        let data = results.data;
        setVocabs(data)
        snackbar.openSnackbar({
          duration: 3000,
          text: "Load data successfully!",
          type: "success",
        });
      },
      error: () => {
        snackbar.openSnackbar({
          duration: 3000,
          text: "Load data failed. Please try again!",
          type: "error",
        });
      },
    });
  }, [])
  return (
    <Page className="page">
      <div className="section-container">
        hello2
      </div>
    </Page>
  );
};

export default HomePage;
