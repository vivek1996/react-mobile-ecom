import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Grid } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import DataContext from '../../context';
import { groupBy, size } from 'lodash';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const FilterComponent = (props) => {
  const { allData } = useContext(DataContext);
  const classes = useStyles();
  const { title, types, handleChange } = props;

  const type = title === 'RAM' ? 'memory' : title === 'OS' ? 'os' : 'storage';

  const getCount = (name) => {
    const group = groupBy(allData, type);
    return size(group[name]);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <div className={classes.root}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container>
                {types.map((type) => (
                  <Grid
                    item
                    xs={12}
                    key={type.name}
                    style={{ textAlign: 'left' }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          // disabled={!getCount(type.name)}
                          checked={type.checked}
                          onChange={handleChange}
                          name={type.name}
                          color="primary"
                        />
                      }
                      label={type.name}
                    />{' '}
                    <span>({getCount(type.name)})</span>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </div>
      </Grid>
    </Grid>
  );
};

export default FilterComponent;
