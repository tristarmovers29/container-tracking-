
const trackingLinks = {
  msc: "https://www.msc.com/en/track-a-shipment",
  maersk: "https://www.maersk.com/tracking/",
  cma: "https://www.cma-cgm.com/",
  hapag: "https://www.hapag-lloyd.com/en/online-business/track/track.html",
  cosco: "https://elines.coscoshipping.com/ebusiness/cargotracking",
  one: "https://ecomm.one-line.com/one-ecom/manage-shipment/cargo-tracking",
  evergreen: "https://www.evergreen-marine.com/",
  zim: "https://www.zim.com/tools/track-a-shipment",
  oocl: "https://www.oocl.com/",
  yangming: "https://www.yangming.com/",
  hmm: "https://www.hmm21.com/"
};

function trackContainer() {
  const shippingLine = document.getElementById("shippingLine");
  const containerInput = document.getElementById("containerNo");
  const errorBox = document.getElementById("error");

  if (!shippingLine || !containerInput) {
    alert("HTML mein shippingLine ya containerNo element nahi mila.");
    return;
  }

  const carrier = shippingLine.value;
  const containerNo = containerInput.value.trim().toUpperCase();

  if (errorBox) {
    errorBox.textContent = "";
    errorBox.classList.add("hidden");
  }

  if (!carrier) {
    showError("Please select a shipping line.");
    return;
  }

  if (!containerNo) {
    showError("Please enter a container or booking number.");
    containerInput.focus();
    return;
  }

  const trackingUrl = trackingLinks[carrier];

  if (!trackingUrl) {
    showError("Tracking link is not available for this shipping line.");
    return;
  }

  // Save the reference so the user can copy it easily.
  try {
    sessionStorage.setItem("containerReference", containerNo);
    sessionStorage.setItem("shippingLine", carrier);
  } catch (e) {
    // Continue even if browser storage is unavailable.
  }

  // Open the shipping line's official website.
  window.open(trackingUrl, "_blank", "noopener,noreferrer");
}

function showError(message) {
  const errorBox = document.getElementById("error");

  if (errorBox) {
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
  } else {
    alert(message);
  }
}

async function copyContainerNumber() {
  const containerInput = document.getElementById("containerNo");
  let containerNo = containerInput ? containerInput.value.trim() : "";

  if (!containerNo) {
    try {
      containerNo = sessionStorage.getItem("containerReference") || "";
    } catch (e) {
      containerNo = "";
    }
  }

  if (!containerNo) {
    showError("Please enter a container or booking number first.");
    return;
  }

  try {
    await navigator.clipboard.writeText(containerNo.toUpperCase());
    alert("Container number copied: " + containerNo.toUpperCase());
  } catch (e) {
    // Fallback for browsers where Clipboard API is unavailable.
    const tempInput = document.createElement("textarea");
    tempInput.value = containerNo.toUpperCase();
    tempInput.style.position = "fixed";
    tempInput.style.opacity = "0";
    document.body.appendChild(tempInput);
    tempInput.select();

    const copied = document.execCommand("copy");
    tempInput.remove();

    if (copied) {
      alert("Container number copied: " + containerNo.toUpperCase());
    } else {
      alert("Please copy this number manually: " + containerNo.toUpperCase());
    }
  }
}

// Allow Enter key to start tracking.
document.addEventListener("DOMContentLoaded", function () {
  const containerInput = document.getElementById("containerNo");

  if (containerInput) {
    containerInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        trackContainer();
      }
    });
  }
});
