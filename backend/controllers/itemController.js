const Item=require('../models/Item')

exports.addItem = async (req,res) =>{
    const imageUrls = req.files ? req.files.map(file => file.path) : [];
    const item=await Item.create({
        ...req.body,
        images:imageUrls,
        seller: req.user
    });
    res.status(201).json(item);

}

exports.markAsSold = async (req, res) => {
  req.item.sold = true;
  await req.item.save();
  res.json({ message: "Item marked as sold" });
};


exports.getItems=async (req,res) => {
    const {semester,department,category}=req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    let filter={sold: false};

    if(semester){
        filter.semester=semester;
    }   
    if(department){
        filter.department=department;
    }   
    if(category){
        filter.category=category;
    }   
    const total = await Item.countDocuments(filter);

    const items = await Item.find(filter)
        .populate('seller', 'name department')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    res.json({
        page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        items
    });
}

exports.markAsSold = async (req, res) => {
    req.item.sold = true;
    await req.item.save();
    res.json({ message: "Item marked as sold" });
};

exports.deleteItem = async (req, res) => {
    await req.item.deleteOne();
    res.json({ message: "Item deleted successfully" });
};

exports.updateItem = async (req, res) => {
    const fields = [
        'title',
        'description',
        'price',
        'category',
        'semester',
        'department'
    ];

    fields.forEach(field => {
        if (req.body[field] !== undefined) {
            req.item[field] = req.body[field];
        }
    });

    await req.item.save();
    res.json(req.item);
};
