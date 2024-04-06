exports.handler = async (event) => {
    // Logic to handle the success case
    return {
      statusCode: 302,
      headers: {
        Location: "http://your-frontend-domain/success",
      },
      body: JSON.stringify({ message: "Payment successful" }),
    };
  };
  