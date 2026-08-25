import {
  toBase64Url,
  fromBase64Url,
} from "./crypto.js";

const encoder = new TextEncoder();

async function getSigningKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign", "verify"]
  );
}

export async function createJwt(payload, secret, expiresInSeconds = 86400) {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);

  const finalPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = toBase64Url(
    encoder.encode(JSON.stringify(header))
  );

  const encodedPayload = toBase64Url(
    encoder.encode(JSON.stringify(finalPayload))
  );

  const unsignedToken =
    `${encodedHeader}.${encodedPayload}`;

  const key = await getSigningKey(secret);

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(unsignedToken)
  );

  return `${unsignedToken}.${toBase64Url(signature)}`;
}

export async function verifyJwt(token, secret) {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const [encodedHeader, encodedPayload, encodedSignature] =
      parts;

    const unsignedToken =
      `${encodedHeader}.${encodedPayload}`;

    const key = await getSigningKey(secret);

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(encodedSignature),
      encoder.encode(unsignedToken)
    );

    if (!valid) {
      return null;
    }

    const payload = JSON.parse(
      new TextDecoder().decode(
        fromBase64Url(encodedPayload)
      )
    );

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
