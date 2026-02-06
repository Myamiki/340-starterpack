invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id
    const vehicle = await inventoryModel.getVehicleById(inv_id)

    const vehicleHTML = utilities.buildVehicleDetail(vehicle)
    const nav = await utilities.getNav()

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleHTML,
    })
  } catch (error) {
    next(error)
  }
}

invCont.triggerError = async function (req, res, next) {
  try {
    throw new Error("Intentional 500 Server Error")
  } catch (error) {
    next(error)
  }
}
