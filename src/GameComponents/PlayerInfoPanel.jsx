import { Box, Typography, Grid, Paper, Button} from "@mui/material"


export default function PlayerInfoPanel({ photo, playername, point=null, pattern=null, hiragana, number}){
    return (
    <Box>
        <Grid container spacing={2}>
            <Grid item xs={5}>
                <Box sx={{height:'150px'}}>
                    <Box sx={{width:'auto',justifyContent: 'center', display: 'flex', }}>
                        <img src={`${photo}`} style={{borderRadius: '50%'}}></img>
                    </Box>
                    <Typography variant='h5' sx={{width:'auto',justifyContent: 'center', display: 'flex', }}>{playername}</Typography>
                </Box>
            </Grid>
            <Grid item xs={7}>
                <Typography variant='h4' sx={{width:'auto', height:'100px', justifyContent: 'center', textAlign:'center', alignItems:'center',display: 'flex', }}>{point}pt</Typography>
            </Grid>
            <Grid item xs={12} sx={{height:'100px'}}>
                <Typography variant='h4' style={{ height: 'minmax(100px, 200px)', backgroundColor: '#4CAF50' }} sx={{width:'auto', height:'100px', justifyContent: 'center', textAlign:'center', alignItems:'center',display: 'flex', }}>{pattern}</Typography>
            </Grid>
            <Grid xs={12} style={{height:'20px'}}></Grid>
            <Grid item xs={12} sx={{height:'100px'}}>
                <Grid container spacing={2} columnSpacing={1} rowSpacing={1}>
                    {hiragana.map((moji, index) => (
                        <Grid item xs={4} style={{ height: 'minmax(100px, 200px)'}} sx={{height:'80px'}}>
                            <Paper sx={{ padding: 2, height:'80%', display: 'flex', justifyContent: 'center', border: '2px solid black', boxSizing: 'border-box'}}>
                                <Button>
                                    <Typography variant="h5" sx={{width:'auto', height:'auto', justifyContent: 'center', textAlign:'center', alignItems:'center',display: 'flex', }}>{moji}</Typography>
                                </Button>
                            </Paper>
                        </Grid>             
                    ))}
                    {number.map((num, index) => (
                        <Grid item xs={4} style={{ height: 'minmax(100px, 200px)'}} sx={{height:'80px'}}>
                            <Paper sx={{ padding: 2, height:'80%', display: 'flex', justifyContent: 'center', border: '2px solid black', boxSizing: 'border-box'}}>
                                <Typography variant="h5" sx={{width:'auto', height:'auto', justifyContent: 'center', textAlign:'center', alignItems:'center',display: 'flex', }}>{num}</Typography>
                            </Paper>
                        </Grid>             
                    ))}
                </Grid>
           </Grid>

        </Grid>
    </Box>
    )
}