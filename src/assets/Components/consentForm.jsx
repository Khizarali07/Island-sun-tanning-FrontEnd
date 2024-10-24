import SignatureCanvas from "react-signature-canvas"; // Signature pad for capturing touch signatures

import PropTypes from "prop-types";
import toast from "react-hot-toast";

// Render consent form section with signature pad
const ConsentForm = ({
  isConsentChecked,
  setIsConsentChecked,
  setConsentSignature,
  clearSignature,
  sigCanvasRef,
}) => {
  // Save the signature from the canvas
  const saveSignature = () => {
    if (sigCanvasRef.current.isEmpty()) {
      toast.error("Please provide a signature.", {
        duration: 2000,
        position: "top-center",
      });
      return;
    }
    console.log(sigCanvasRef.current);

    const signatureData = sigCanvasRef.current
      .getTrimmedCanvas()
      .toDataURL("image/png");

    console.log(signatureData);
    setConsentSignature(signatureData); // Set signature as base64 string
    toast.success("Signature Save Successfully", {
      duration: 2000,
      position: "top-center",
    });
  };

  return (
    <div className="consent-section">
      <h4>
        <b>
          <u>Client Release and Informed Consent</u>{" "}
        </b>
      </h4>
      <p>
        <b>
          CLIENT RELEASE AND INFORMED CONSENT PLEASE READ THE FOLLOWING
          INFORMATION AND ACKNOWLEDGE THAT YOU UNDERSTAND AND ACCEPT ALL
          PROVISIONS BY SIGNING BELOW.{" "}
        </b>
        <br />
        <br />
        It is our intention to keep you as well informed about tanning as
        possible. This means informing you how to operate the tanning equipment.
        The proper procedure to follow in the tanning room will be clearly
        explained by a member of our staff. Please feel free to ask any
        questions. <br />
        <br />
        IF YOU DO NOT DEVELOP A TAN OUTDOORS, YOU ARE UNLIKELY TO TAN FROM THE
        USE OF ANY TANNING DEVICE. <br />
        <br />
        AVOID OVEREXPOSURE. As with natural sunlight, overexposure can cause eye
        and skin injury and allergic reactions. Repeated overexposure may cause
        photo aging of the skin, dryness, wrinkling, and, in some instances,
        skin cancer. We recommend that you do not tan outdoors on days you are
        tanning indoors. Do not tan if you currently have a sunburn and do not
        tan more than once in a 24-hour period. <br />
        <br />
        WEAR PROTECTIVE EYEWEAR. Failure to wear protective eyewear may result
        in severe burns or long-term injury to the eyes. <br />
        <br />I have read the contents of this consent form carefully and state
        that I am not aware of any medical condition or other reason that would
        prohibit me from tanning. I understand that I will not be allowed to
        exceed the maximum allowable time posted on the tanning device. I have
        been given adequate instructions for the proper use of the tanning
        equipment, understand the risks involved, and use it at my own risk. I
        hereby agree to release the owners, operators, and manufacturers from
        any damages that I might incur due to the use of this facility.
      </p>
      <div className="consent-checkbox">
        <input
          type="checkbox"
          id="consent"
          onChange={() => setIsConsentChecked(!isConsentChecked)}
          checked={isConsentChecked}
        />
        <label htmlFor="consent">I agree to the terms and conditions.</label>
      </div>

      {/* Signature Pad */}
      <div className="signature-section">
        <label>Signature:</label>
        <SignatureCanvas
          ref={sigCanvasRef}
          canvasProps={{ className: "signature-canvas" }}
          penColor="black"
          backgroundColor="#f9f9f9"
        />
        <div className="signature-actions">
          <button type="button" onClick={clearSignature}>
            Clear
          </button>
          <button type="button" onClick={saveSignature}>
            Save Signature
          </button>
        </div>
      </div>
    </div>
  );
};

ConsentForm.propTypes = {
  isConsentChecked: PropTypes.bool.isRequired,
  setIsConsentChecked: PropTypes.func.isRequired,
  setConsentSignature: PropTypes.func.isRequired,
  clearSignature: PropTypes.func.isRequired,
  sigCanvasRef: PropTypes.object.isRequired, // Signature pad ref
};

export default ConsentForm;
