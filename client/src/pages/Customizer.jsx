import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useSnapshot } from "valtio";
import {
  AIPicker,
  ColorPicker,
  CustomButton,
  FilePicker,
  Tab,
} from "../components";
import { DecalTypes, EditorTabs, FilterTabs } from "../config/constants";
import { reader } from "../config/helpers";
import { fadeAnimation, slideAnimation } from "../config/motion";
import state from "../store";
const Customizer = () => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");

  const [generatingImg, setGeneratingImg] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });
  // show tab content depending on the active tab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker":
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (type) => {
    if (!prompt) return alert("Please enter a prompt");
    try {
      // call out backend to generate an image
      setGeneratingImg(true);
      const response = await fetch("http://localhost:5000/api/v1/dalle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      handleDecals(type, `data:image/png;base64,${data.photo}`);
    } catch (err) {
      alert(err);
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  };
  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }
    // after setting the state, activeFilterTab is updated
    setActiveFilterTab((prev) => ({
      ...prev,
      [tabName]: !prev[tabName],
    }));
  };
  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = result;

    console.log(decalType);
    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };
  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  };
  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)}
                  >
                    {tab.name}
                  </Tab>
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>
          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
            key="customizer"
          >
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => (state.intro = true)}
              customStyles={"w-fit px-4 py-2.5 font-bold text-sm"}
            />
          </motion.div>
          <motion.div
            className="filtertabs-container"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                isFilter
                isActiveTab={activeFilterTab[tab.name]}
                key={tab.name}
                tab={tab}
                handleClick={() => handleActiveFilterTab(tab.name)}
              >
                {tab.name}
              </Tab>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
