// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import SendGridClient from '@sendgrid/mail';

type RequestData = {
  email: string;
  ref_id: string;
};

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const requestBody = req.body as RequestData;
  if (!requestBody.ref_id || !requestBody.email) {
    res.redirect('/trustplace/support');
  }

  try {
    // Verify product with TrustPlace
    const trustPlaceResponse = await verifyTrustplaceProduct(
      requestBody.email,
      requestBody.ref_id
    );

    if (
      trustPlaceResponse &&
      trustPlaceResponse.success &&
      trustPlaceResponse.data?.valid
    ) {
      // Send an email with link to instant resalse
      await sendVestiaireEmail(requestBody.email);

      res.redirect('/trustplace/email');
    }
  } catch (ex) {
    console.error('Error occurred.', ex);
  }
  res.redirect('/trustplace/support');
}

type TrustPlaceProductVerification = {
  success: boolean;
  data: {
    valid: boolean;
  };
};

const verifyTrustplaceProduct = async (email: string, reference: string) => {
  //TODO: AUTH
  const result = await fetch(process.env.TRUSTPLACE_URL as string, {
    body: JSON.stringify({
      email,
      reference
    })
  });

  if (!result.ok) {
    console.error(
      `Error response received from trustplace API. StatusCode: ${result.status}.  StatusText: ${result.statusText}`
    );
  }

  try {
    const jsonResponse = await result.json();
    console.log('Response:', jsonResponse);
    return jsonResponse as TrustPlaceProductVerification;
  } catch (ex) {
    console.error(`Exception parsing Trustplace response as JSON.`, ex);
  }
};

const sendVestiaireEmail = async (email: string) => {
  const resale_url = process.env.VESTIAIRE_URL;

  SendGridClient.setApiKey(process.env.SENDGRID_API_KEY as string);

  const from: { email: string; name: string; address?: string } = {
    email: process.env.SENDGRID_FROM_EMAIL as string,
    name: process.env.SENDGRID_FROM_NAME as string
  };
  const to = {
    email: email
    //name: `${claimRequest.firstName} ${claimRequest.lastName}`
  };
  const subject = `Welcome to Chloe Instant Resale`;
  const msg: any = {
    to: to,
    from: from,
    templateId: process.env.SENDGRID_TEMPLATE_ID,
    dynamic_template_data: {
      subject,
      resale_url: resale_url
    }
  };

  const response = await SendGridClient.send(msg);

  if (response[0].statusCode === 202) {
    console.log('Successfully sent instant resale email.');
  } else {
    console.error(
      `Error sending instant resale email. HttpStatusCode: ${response[0].statusCode}`
    );
    console.log(response[0]);
  }
};
