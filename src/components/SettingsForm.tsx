import { Info } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Settings from "../types/Settings";

type Props = {
  settings: Settings;
  onSettingsChange: (newSettings: Settings) => void;
};

const SettingsForm: React.FC<Props> = ({
  onSettingsChange: setSettings,
  settings,
}) => {
  return (
    <Accordion
      sx={(theme) => ({
        width: 1,
        mb: theme.spacing(2),
        mt: theme.spacing(2),
      })}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Settings</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="column" width="100%" gap={2}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.colorized}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      colorized: event.target.checked,
                    })
                  }
                />
              }
              label={
                <>
                  Colorized
                  <Tooltip
                    sx={{ verticalAlign: "center" }}
                    title="Attempts to create a colorized vector graphic"
                  >
                    <Info sx={{ mr: 2 }} />
                  </Tooltip>
                </>
              }
            />
          </FormGroup>
          <FormControl fullWidth>
            <InputLabel id="settings-fillStrategy">Fill Strategy</InputLabel>
            <Select
              label="Fill Strategy"
              labelId="settings-fillStrategy"
              value={settings.fillStrategy}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  fillStrategy: event.target.value,
                })
              }
              endAdornment={
                <Tooltip title="Fill Strategy determines how fill color for each layer should be selected">
                  <Info sx={{ mr: 2 }} />
                </Tooltip>
              }
            >
              <MenuItem value="dominant">DOMINANT (default)</MenuItem>
              <MenuItem value="mean">MEAN</MenuItem>
              <MenuItem value="median">MEDIAN</MenuItem>
              <MenuItem value="spread">SPREAD</MenuItem>{" "}
            </Select>
          </FormControl>
          <TextField
            label="Steps"
            type="number"
            value={settings.steps}
            placeholder="leave empty for auto (default)"
            onChange={(e) => {
              setSettings({
                ...settings,
                steps: Number(e.target.value),
              });
            }}
            InputProps={{
              endAdornment: (
                <Tooltip title="Steps specifies desired number of layers in resulting image">
                  <Info />
                </Tooltip>
              ),
            }}
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
export default SettingsForm;
