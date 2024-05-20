const endpoint = "https://localhost:5000/api/v1";
const uuidv4Script = document.createElement("script");
uuidv4Script.src = "https://cdn.jsdelivr.net/npm/uuid@3/dist/umd/uuidv4.min.js";
document.head.appendChild(uuidv4Script);

const converta = {
  init() {
    if (isAdReferred()) {
      const urlParams = new URLSearchParams(window.location.search);
      const campaign = urlParams.get("utm_campaign");
      this.setPayload({
        leadId: uuidv4(),
        conv: false,
        on: false,
        campaign,
      });
    }
  },
  setPayload(payloadObj) {
    localStorage.setItem("converta", JSON.stringify(payloadObj));
  },
  handleSignIn(email) {
    const lead = getLead(email);
    let convertaPayload = localStorage.getItem("converta");

    if (lead || convertaPayload) {
      if (!convertaPayload) {
        convertaPayload = JSON.stringify({
          leadId: uuidv4(),
          conv: false,
          on: false,
          campaign: lead.pixelId || null,
        });
      }

      let payloadObj = JSON.parse(convertaPayload);
      payloadObj.on = true;

      if (lead) {
        payloadObj.leadId = lead.leadId;
        payloadObj.conv = true;
      }

      this.setPayload(payloadObj);
    }
  },
  sendEvent(eventData, accessToken) {
    const convertaPayload = localStorage.getItem("converta");

    if (!convertaPayload) {
      console.error("Payload not found in localStorage");
      return;
    }

    const payloadObj = JSON.parse(convertaPayload);
    const queryParams = {
      isOnline: payloadObj.on,
      isConverted: payloadObj.conv,
      accessToken,
    };

    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${endpoint}/metaevents?${queryString}`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
      .then((res) => res.json())
      .then((data) => console.log("Event sent successfully:", data))
      .catch((err) => console.error("Error sending event:", err));
  },
};

function isAdReferred() {
  const urlParams = new URLSearchParams(window.location.search);
  return (
    urlParams.has("utm_source") &&
    urlParams.has("utm_medium") &&
    urlParams.has("utm_campaign")
  );
}

async function getLead(email) {
  const url = `${endpoint}/leads?email=${email}`;
  let data = null;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    data = await res.json();
  } catch (err) {
    console.error("Error sending event:", err);
  }
  return data;
}

// Usage:
// converta.init();
// converta.handleSignIn(email);
// converta.sendEvent(eventData, accessToken);
