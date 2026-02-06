// Vehicle detail route
router.get("/detail/:inv_id", inventoryController.buildByInventoryId)

// Intentional error route (Task 3)
router.get("/error", inventoryController.triggerError)
