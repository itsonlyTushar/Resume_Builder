import { useEffect } from "react";
import {
  useLocation,
} from "react-router-dom";
import { Template01 } from "../components/Templates/Template01";
import { Template02 } from "../components/Templates/Template02";
import { Template03 } from "../components/Templates/Template03";


// custom functon will scorll to top after every page changes
export const ScrollTop = () => {
  const path = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);
};

const TEMPLATE_REGISTRY = {
  101: Template01,
  102: Template02,
  103: Template03
};

// generates template on selected templates
export const generatePDF = ({ formData }) => {
  const selected_template = formData.selected_template || 101;

  const templateGenerator = TEMPLATE_REGISTRY[selected_template];

  if (!templateGenerator) {
    console.error(`Template ${selected_template} not found`);
    throw new Error(`Template ${selected_template} is not implemented`);
  }

  return templateGenerator({ formData });
};



// does the checking of if string or object is not empty
export const checkStr = (str) => str.trim().length > 0;
  
export const checkEach = (details, str) => {
  return details.some((obj) => obj[str] !== "");
};