import { pool } from "../utils/db.js";

export const identify = async (req, res) => {
  try {
    const { email, phoneNumber: phone } = req.body;
    if (!email && !phone) {
      return res.status(400).json({ error: "Email or phone required" });
    }

    // Find matching contacts (ordered by creation time and ID)
    const params = [];
    let q = `SELECT * FROM contacts WHERE deletedat IS NULL AND (false`;
    if (email) q += ` OR email = $${params.push(email)}`;
    if (phone) q += ` OR phonenumber = $${params.push(phone)}`;
    q += `) ORDER BY createdat ASC, id ASC`;

    const { rows: matches } = await pool.query(q, params);

    // Case: New contact
    if (!matches.length) {
      const {
        rows: [contact],
      } = await pool.query(
        `INSERT INTO contacts (email, phonenumber, linkprecedence, createdat, updatedat)
         VALUES ($1, $2, 'primary', NOW(), NOW()) RETURNING *`,
        [email || null, phone || null]
      );
      return res.json({
        contact: {
          primaryContatctId: contact.id,
          emails: contact.email ? [contact.email] : [],
          phoneNumbers: contact.phonenumber ? [contact.phonenumber] : [],
          secondaryContactIds: [],
        },
      });
    }

    // Find oldest primary contact
    let primaryId = null;
    let oldest = new Date();
    const candidateIds = new Set();

    for (const c of matches) {
      if (c.linkprecedence === "primary") {
        candidateIds.add(c.id);
        const cTime = c.createdat.getTime();
        const oldestTime = oldest.getTime();
        if (cTime < oldestTime || (cTime === oldestTime && c.id < primaryId)) {
          oldest = c.createdat;
          primaryId = c.id;
        }
      } else if (c.linkedid) {
        candidateIds.add(c.linkedid);
        const {
          rows: [p],
        } = await pool.query(
          `SELECT * FROM contacts WHERE id = $1 AND deletedat IS NULL`,
          [c.linkedid]
        );
        if (p) {
          const pTime = p.createdat.getTime();
          const oldestTime = oldest.getTime();
          if (
            pTime < oldestTime ||
            (pTime === oldestTime && p.id < primaryId)
          ) {
            oldest = p.createdat;
            primaryId = p.id;
          }
        }
      }
    }

    // Fallback if no primary found
    if (!primaryId) {
      const oldestMatch = matches.reduce((a, b) =>
        a.createdat < b.createdat
          ? a
          : b.createdat > b.createdat
          ? b
          : a.id < b.id
          ? a
          : b
      );
      primaryId =
        oldestMatch.linkprecedence === "secondary"
          ? oldestMatch.linkedid
          : oldestMatch.id;
    }

    // Demote newer primaries (with timestamp tie-breaking)
    for (const id of candidateIds) {
      if (id === primaryId) continue;

      const {
        rows: [c],
      } = await pool.query(`SELECT * FROM contacts WHERE id = $1`, [id]);

      if (!c) continue;

      const cTime = c.createdat.getTime();
      const oldestTime = oldest.getTime();
      const isNewer = cTime > oldestTime;
      const isSameTime = cTime === oldestTime;
      const shouldDemote =
        c.linkprecedence === "primary" &&
        (isNewer || (isSameTime && c.id !== primaryId));

      if (shouldDemote) {
        await pool.query(
          `UPDATE contacts SET 
            linkprecedence = 'secondary', 
            linkedid = $1, 
            updatedat = NOW() 
           WHERE id = $2 AND linkprecedence = 'primary'`,
          [primaryId, id]
        );
        await pool.query(
          `UPDATE contacts SET linkedid = $1 
           WHERE linkedid = $2 AND deletedat IS NULL`,
          [primaryId, id]
        );
      }
    }

    // Get consolidated contacts
    const { rows: consol } = await pool.query(
      `SELECT * FROM contacts 
       WHERE deletedat IS NULL AND (id = $1 OR linkedid = $1)`,
      [primaryId]
    );

    // Add new contact if needed
    const emails = new Set(consol.map((c) => c.email).filter(Boolean));
    const phones = new Set(consol.map((c) => c.phonenumber).filter(Boolean));
    const exists = consol.some(
      (c) => c.email === email && c.phonenumber === phone
    );

    if (
      !exists &&
      ((email && !emails.has(email)) || (phone && !phones.has(phone)))
    ) {
      const {
        rows: [newSec],
      } = await pool.query(
        `INSERT INTO contacts (email, phonenumber, linkedid, linkprecedence, createdat, updatedat)
         VALUES ($1, $2, $3, 'secondary', NOW(), NOW()) RETURNING *`,
        [email || null, phone || null, primaryId]
      );
      consol.push(newSec);
      if (newSec.email) emails.add(newSec.email);
      if (newSec.phonenumber) phones.add(newSec.phonenumber);
    }

    // Prepare response
    const primary = consol.find((c) => c.id === primaryId);
    const secIds = consol
      .filter((c) => c.linkprecedence === "secondary")
      .map((c) => c.id)
      .sort((a, b) => a - b);

    return res.json({
      contact: {
        primaryContatctId: primaryId,
        emails: [
          ...(primary?.email ? [primary.email] : []),
          ...[...emails].filter((e) => e !== primary?.email),
        ],
        phoneNumbers: [
          ...(primary?.phonenumber ? [primary.phonenumber] : []),
          ...[...phones].filter((p) => p !== primary?.phonenumber),
        ],
        secondaryContactIds: secIds,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
