import { isLoggedIn } from '@civic/auth/server';

const authMiddleware = async (req, res, next) => {
  if (!(await req.civicAuth.isLoggedIn())) {
    return res.status(401).send('Unauthorized');
  }
  next();
};

app.get('/protected', authMiddleware, async (req, res) => {
  const civicUser = await req.civicAuth.getUser();
  const dbUser = await prisma.user.findUnique({
    where: { email: civicUser.email },
  });
  res.json({ civicUser, dbUser });
});
