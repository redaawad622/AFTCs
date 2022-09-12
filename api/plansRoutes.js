module.exports = function (app, prisma) {
  app.post('/expectedPlanTransaction', async (req, res) => {
    const plans = await req.body
    const expected = await prisma.ExpectedPlan.upsert({
      where: {
        user_id: plans.user_id,
      },
      create: plans,
      update: plans,
    })

    res.json(expected)
  })
}
