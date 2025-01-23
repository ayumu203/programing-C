import { Grid, Typography } from '@mui/material';
import Login from './Login';
import { GraphicEq } from '@mui/icons-material';
import './index.css';

export const Header = () =>{
    return(<>
        <Grid container
           sx={{
              height: '140px',
              alignItems: 'center',
              borderBottom:'3px solid gray',
              paddingTop: "10px",
              paddingBottom:"10px"
            }}>
            <Grid xs={3}>

            </Grid>

            <Grid xs={6}>
              <Typography
                sx={{
                  fontFamily: '"Anton", sans-serif',
                  fontSize: '80px',
                  textAlign: 'center',
                  height: 'auto',
                }}>
                Regelook
              </Typography>
            </Grid>

            <Grid xs={3}>
              <Login></Login>
            </Grid>
        </Grid>
    </>)
}