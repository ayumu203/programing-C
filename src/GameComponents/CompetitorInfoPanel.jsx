import { Box, Typography } from "@mui/material"

export const CompetitorInfoPanel = (opponent) => {
    return( 
    <Box>
        {opponent ? 
            <Box>
                <Typography>マッチング中です</Typography>
            </Box>
        :
        <Box>
            <Typography>{opponent.UserName}</Typography>
            <img src={`${opponent.PhotoURL}`}></img>        
        </Box>
        }
    </Box> 
    )
}