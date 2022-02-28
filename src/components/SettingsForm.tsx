import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
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
    <Accordion className="mt-4">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Settings</Accordion.Header>
        <Accordion.Body>
          <Form>
            <Form.Group controlId="settingsFillStrategy">
              <Form.Label>Fill Strategy</Form.Label>
              <Form.Select
                aria-label="Fill Strategy"
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    fillStrategy: event.target.value,
                  })
                }
                value={settings.fillStrategy}
              >
                <option value="dominant">DOMINANT (default)</option>
                <option value="mean">MEAN</option>
                <option value="median">MEDIAN</option>
                <option value="spread">SPREAD</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="settingsSteps">
              <Form.Label>Steps</Form.Label>
              <Form.Control
                aria-label="Steps"
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    steps: Number(event.target.value),
                  })
                }
                value={settings.steps}
                type="number"
                placeholder="auto (default)"
              />
            </Form.Group>
          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};
export default SettingsForm;
