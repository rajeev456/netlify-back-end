exports.handler = async (event) => {
    // Logic to handle the cancellation case
    return {
      statusCode: 302,
      headers: {
        Location: "http://your-frontend-domain/failure",
      },
      body: JSON.stringify({ message: "Payment canceled" }),
    };
  };
  