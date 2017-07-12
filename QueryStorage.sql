----Query Storage H-Stock 2017---
----12-7-2017-----
---Hoang

create proc GetProduct
as
begin
	select row_number() over(order by barcode asc) as STT, barcode,model,size,color,price,brand,division_code,descriptionVietnamese
	from Products
end

GetProduct

create proc spInsertUpdateProduct
@mode int,
@barcode nvarchar(20),
@model nvarchar(200),
@size nvarchar(200),
@color nvarchar(200),
@price int,
@brand nvarchar(200),
@division_code nvarchar(200),
@descriptionVietnamese nvarchar(2000)
as
begin
	if @mode = 1 --Insert
		begin
			INSERT INTO Products (barcode,model,size,color,price,brand,division_code,descriptionVietnamese)
			VALUES(@barcode,@model,@size,@color,@price,@brand,@division_code,@descriptionVietnamese)
		end
	else if @mode = 2 --Update
		begin
			UPDATE Products SET model = @model, size = @size, color = @color, price = @price, brand = @brand, division_code=@division_code,descriptionVietnamese=@descriptionVietnamese
			WHERE barcode = @barcode
		end
	else if @mode = 3 --delete
		begin
			DELETE Products WHERE barcode = @barcode
		end
end