Static assets like videos must be placed under frontend/public to be served by CRA.
Place your background video at: frontend/public/uploads/background1.mp4
Then reference it in code as: (process.env.PUBLIC_URL || '') + '/uploads/background1.mp4'
