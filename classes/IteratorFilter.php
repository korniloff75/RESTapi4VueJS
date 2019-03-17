<?php
class IteratorFilter extends FilterIterator
{
    private function callback() {}

    public function __construct(Iterator $iterator, $callback )
    {
        parent::__construct($iterator);
        $this->callback = $callback;
    }

    public function accept()
    {
			$cur = $this->getInnerIterator()->current();
			return $this->callback($cur);
    }
}


/* $filesFilter = new IteratorFilter($allFiles, function($i) {
	return $i->isFile();
}); */