import { Box, Typography } from '@mui/material';
import Login from './Login';
export const Header = () =>{
    return(<>
        <Box
           sx={{
              display:'flex',
              justifyContent: 'space-between',
              borderBottom:3,
              borderColor:'gray',
              paddingBottom:"10px"
            }}>
            <Typography
              fontSize={'h3.fontSize'}
            >
              Regelook
            </Typography>
            <Login></Login>
        </Box>
    </>)
}