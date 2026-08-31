window.ZORIX_STATUS_EVENTS = {
  "updatedAt": "2026-08-31T14:56:24+02:00",
  "events": [
    {
      "id": "zrx-20260831-1345-code-capacity",
      "type": "capacity",
      "severity": "major",
      "status": "resolved",
      "title": "Nex Coder and VIREXA temporarily paused in Zorix Code",
      "summary": "Zorix Code temporarily suspended support for the Nex Coder and VIREXA model series because of exceptionally high demand. Service was restored at 14:57 CEST.",
      "startedAt": "2026-08-31T13:45:00+02:00",
      "affected": [
        "zorix-code",
        "nex",
        "virexa"
      ],
      "source": "Zorix operational notice",
      "sourceRef": "2026-08-31 13:45 CEST capacity notice",
      "attribution": null,
      "details": [
        "Zorix Code is experiencing exceptionally high demand.",
        "Nex Coder model support inside Zorix Code has been temporarily suspended.",
        "VIREXA model support inside Zorix Code has been temporarily suspended.",
        "The suspension is a capacity-protection measure and does not by itself indicate a security compromise.",
        "Nex Coder and VIREXA support in Zorix Code was restored at 14:57 CEST on 2026-08-31.",
        "The capacity event lasted approximately 1 hour and 12 minutes."
      ],
      "resolvedAt": "2026-08-31T14:57:00+02:00"
    },
    {
      "id": "zrx-20260822-110607-exfil",
      "type": "security",
      "severity": "critical",
      "status": "resolved",
      "title": "Protected asset exfiltration reported by security log",
      "summary": "A retained Zorix security log records repeated access attempts involving /secure/vault/zorix.txt. Initial attempts were blocked. A later record is marked Exfiltration confirmed.",
      "startedAt": "2026-08-22T11:06:03+02:00",
      "resolvedAt": "2026-08-22T11:06:07+02:00",
      "affected": [
        "zorix-api"
      ],
      "source": "Security incident log",
      "sourceRef": "zorix_security_incident_20260822_1106_CEST.log",
      "attribution": "The log records an attribution, but that attribution has not been independently verified for publication.",
      "details": [
        "Protected asset read attempt detected.",
        "Initial connection was blocked by the firewall with zero bytes transferred.",
        "A secondary access vector was detected and blocked.",
        "A later security-agent record is marked Exfiltration confirmed and reports 18,432 bytes transferred.",
        "A forensic chain and retained snapshot were recorded according to the supplied log."
      ]
    },
    {
      "id": "zrx-20260818-cluster-thermal",
      "type": "infrastructure",
      "severity": "major",
      "status": "resolved",
      "title": "Server cluster thermal event",
      "summary": "A thermal issue affected 18 server clusters and services were suspended for cooling, inspection and infrastructure stabilization.",
      "startedAt": "2026-08-18T00:00:00+02:00",
      "resolvedAt": "2026-08-18T23:59:59+02:00",
      "affected": [
        "zorix-api",
        "zorix-code",
        "nex",
        "virexa"
      ],
      "source": "Zorix historical record",
      "sourceRef": "ZORIX — LA NOSTRA STORIA",
      "attribution": null,
      "details": [
        "18 server clusters were reported as affected.",
        "Services were suspended to allow cooling and checks.",
        "Infrastructure was subsequently stabilized."
      ]
    },
    {
      "id": "zrx-20260817-security",
      "type": "security",
      "severity": "major",
      "status": "resolved",
      "title": "Automated probing and possible DDoS activity",
      "summary": "Zorix detected anomalous activity compatible with automated probing and a possible DDoS attempt. Approximately 21,000 security events were analyzed and contained.",
      "startedAt": "2026-08-17T00:00:00+02:00",
      "resolvedAt": "2026-08-17T23:59:59+02:00",
      "affected": [
        "zorix-api"
      ],
      "source": "Zorix historical record",
      "sourceRef": "ZORIX — LA NOSTRA STORIA",
      "attribution": "Unconfirmed. Network fingerprints, IP patterns and token patterns were not considered sufficient evidence to identify an attacker or organization.",
      "details": [
        "Approximately 21,000 security events were analyzed.",
        "Activity was described as compatible with automated probing and a possible DDoS attempt.",
        "Zorix Secure Firewall, Helios-B and Nex Coder 3.6 Pro were identified as components used during analysis and containment.",
        "Attribution remained unconfirmed."
      ]
    },
    {
      "id": "zrx-20260817-free-abuse",
      "type": "capacity",
      "severity": "major",
      "status": "resolved",
      "title": "Abnormal Free-tier usage caused emergency suspension",
      "summary": "Abnormally heavy use of Nex Coder 2.9 Fast through Free access reportedly generated about 5.6 billion tokens and led to a temporary suspension of all models to protect shared infrastructure.",
      "startedAt": "2026-08-17T00:00:00+02:00",
      "resolvedAt": "2026-08-17T23:59:59+02:00",
      "affected": [
        "nex",
        "zorix-code",
        "zorix-api"
      ],
      "source": "Zorix historical record",
      "sourceRef": "ZORIX — LA NOSTRA STORIA",
      "attribution": null,
      "details": [
        "Approximately 5.6 billion tokens were reported.",
        "All models were temporarily suspended to protect shared infrastructure.",
        "Services were later restored.",
        "Temporary registration restrictions were also introduced and subsequently removed."
      ]
    },
    {
      "id": "zrx-20260730-capacity",
      "type": "capacity",
      "severity": "moderate",
      "status": "resolved",
      "title": "Nex Coder 2.9 Fast Free capacity suspension",
      "summary": "Nex Coder 2.9 Fast — Free was temporarily suspended after processing more than 21.2 billion tokens.",
      "startedAt": "2026-07-30T00:00:00+02:00",
      "resolvedAt": "2026-07-30T23:59:59+02:00",
      "affected": [
        "nex"
      ],
      "source": "Zorix historical record",
      "sourceRef": "ZORIX — LA NOSTRA STORIA",
      "attribution": null,
      "details": [
        "The Free model was temporarily suspended.",
        "More than 21.2 billion processed tokens were reported."
      ]
    },
    {
      "id": "zrx-20260530-crash",
      "type": "crash",
      "severity": "critical",
      "status": "resolved",
      "title": "Major Zorix service failure",
      "summary": "Zorix experienced a major malfunction. Parts of the platform stopped working correctly and some services went offline before systems were analyzed and restored.",
      "startedAt": "2026-05-30T00:00:00+02:00",
      "resolvedAt": "2026-05-30T23:59:59+02:00",
      "affected": [
        "zorix-api",
        "zorix-code",
        "nex"
      ],
      "source": "Zorix historical record",
      "sourceRef": "ZORIX — LA NOSTRA STORIA",
      "attribution": null,
      "details": [
        "The platform stopped functioning correctly.",
        "Some services went offline.",
        "The issue was analyzed.",
        "Systems were restored and Zorix returned online."
      ]
    }
  ]
};
