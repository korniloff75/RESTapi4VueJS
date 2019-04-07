/**
 *
 * @param {array} collection - входные данные
 * @param {int} itemsPerPage - количество на странице
 *
 * var paginator = new PaginationHelper([...],10);
 *
 * https://codepen.io/KorniloFF/pen/XOPggr
 */

function PaginationHelper(collection, itemsPerPage){
	this.collection = collection, this.itemsPerPage = itemsPerPage;

	this.itemCount = function() {
	  return this.collection.length;
	}

	this.pageCount = function() {
		return Math.ceil(this.collection.length / this.itemsPerPage);
	}

	this.pageItemCount = function(pageIndex) {
		return pageIndex < this.pageCount()
			? Math.min(this.itemsPerPage, this.collection.length - pageIndex * this.itemsPerPage)
			: -1;
	}

	this.pageIndex = function(itemIndex) {
		return itemIndex < this.collection.length && itemIndex >= 0
			? Math.floor(itemIndex / this.itemsPerPage)
			: -1;
	}

} // PaginationHelper

/////

