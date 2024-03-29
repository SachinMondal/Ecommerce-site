import { Fragment, useEffect, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { navigation } from "./navigationData";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import AuthModal from "../../auth/AuthModal";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "../../../State/Auth/Action";
import { getCart } from "../../../State/Cart/Action";
import { findProducts } from "../../../State/Product/Action";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [openAuthModel, setOpenAuthModel] = useState(false);
  const [anchorEl, setAnchorEl] = useState();
  const [isClosed, setIsClosed] = useState(false);
  const openUserMenu = Boolean(anchorEl);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  console.log(isClosed);
  const auth = useSelector((store) => store.auth);
  const cart = useSelector((store) => store.cart);
  const products = useSelector((store) => store.products);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const data = {
      category: "",
      colors: [],
      size: [],
      minPrice: 0,
      maxPrice: 1000000,
      minDiscount: 0,
      sort: "price_low",
      pageNumber: 1,
      pageSize: 10,
      stock: "",
    };

    dispatch(findProducts(data));
  }, [products.deletedproduct, dispatch]);
  console.log(products);

  const handleSearchInputChange = (e) => {
    const searchQuery = e.target.value;
    setSearchQuery(searchQuery);

    // Update filtered products in state based on the search query
    const updatedFilteredProducts = products?.products?.content?.filter(
      (product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(updatedFilteredProducts);

    setIsClosed(false);
  };

  const handleSearch = () => {
    // You can use the same logic to update filtered products in the handleSearch function
    const updatedFilteredProducts = products?.content?.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(updatedFilteredProducts);

    setIsClosed(true);
  };

  const close = () => {
    setIsClosed(true);
  };

  const handleUserClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = (event) => {
    setAnchorEl(null);
  };

  const handleOpen = () => {
    setOpenAuthModel(true);
  };

  const handleClose = () => {
    setOpenAuthModel(false);
  };

  const handleCategoryChange = (category, section, item, close) => {
    navigate(`/${category.id}/${section.id}/${item.id}`);
    close();
  };

  useEffect(() => {
    const login = async () => {
      setLoading(true);
      // Perform your login logic here, for example:
      await dispatch(getUser(jwt));
      setLoading(false);
      handleClose();
    };

    if (jwt) {
      login();
    }
  }, [jwt, auth.jwt, dispatch]);

  useEffect(() => {
    if (auth.user) {
      handleClose();
    }
  }, [auth.user, navigate]);

  useEffect(() => {
    dispatch(getCart());
  }, [cart.updateCartItem, cart.deleteCartItem, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    handleCloseUserMenu();
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  const handleGoToProfile = () => {
    navigate(`/profile/${auth.user._id}`);
    handleCloseUserMenu();
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleGoToOrder = () => {
    navigate(`/account/order/user/${auth.user._id}`);
    handleCloseUserMenu();
  };

  return (
    <div className="bg-white z-50 relative">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative mt-4 lg:hidden"
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-[4rem]">
                  <button
                    type="button"
                    className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                <Tab.Group as="div" className="mt-2">
                  <div className="border-b border-gray-200">
                    <Tab.List className="-mb-px flex space-x-8 px-4">
                      {navigation.categories.map((category) => (
                        <Tab
                          key={category.name}
                          className={({ selected }) =>
                            classNames(
                              selected
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-gray-900",
                              "flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium"
                            )
                          }
                        >
                          {category.name}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                  <Tab.Panels as={Fragment}>
                    {navigation.categories.map((category) => (
                      <Tab.Panel
                        key={category.name}
                        className="space-y-10 px-4 pb-8 pt-10"
                      >
                        <div className="grid grid-cols-2 gap-x-4">
                          {category.featured.map((item) => (
                            <div
                              key={item.name}
                              className="group relative text-sm"
                            >
                              <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                <img
                                  src={item.imageSrc}
                                  alt={item.imageAlt}
                                  className="object-cover object-center"
                                />
                              </div>
                              <a
                                href={item.href}
                                className="mt-6 block font-medium text-gray-900"
                              >
                                <span
                                  className="absolute inset-0 z-10"
                                  aria-hidden="true"
                                />
                                {item.name}
                              </a>
                              <p aria-hidden="true" className="mt-1">
                                Shop now
                              </p>
                            </div>
                          ))}
                        </div>
                        {category.sections.map((section) => (
                          <div key={section.name}>
                            <p
                              id={`${category.id}-${section.id}-heading-mobile`}
                              className="font-medium text-gray-900"
                            >
                              {section.name}
                            </p>
                            <ul
                              aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                              className="mt-6 flex flex-col space-y-6"
                            >
                              {section.items.map((item) => (
                                <li key={item.name} className="flow-root">
                                  <a
                                    href={item.href}
                                    className="-m-2 block p-2 text-gray-500"
                                  >
                                    {item.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  {navigation?.pages?.map((page) => (
                    <div key={page.name} className="flow-root">
                      <a
                        href={page.href}
                        className="-m-2 block p-2 font-medium text-gray-900"
                      >
                        {page.name}
                      </a>
                    </div>
                  ))}
                </div>

                <div className="flow-root">
                  {auth.user?.firstName ? (
                    <>
                      <Button
                        onClick={handleLogout}
                        className="-m-2 block p-2 font-medium text-gray-900"
                      >
                        Logout
                      </Button>
                      <Button
                        onClick={handleGoToProfile}
                        className="-m-2 block p-2 font-medium text-gray-900"
                      >
                        Profile
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleOpen}
                      className="-m-2 block p-2 font-medium text-gray-900"
                    >
                      Create account
                    </Button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Get free delivery on orders over $100
        </p>

        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              {open ? (
                <button
                  type="button"
                  className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                  onClick={() => setOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6" aria-hidden="false" />
                </button>
              ) : (
                <button
                  type="button"
                  className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                  onClick={() => setOpen(true)}
                >
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              )}

              {/* Logo */}
              <div className="flex lg:ml-0 cursor-pointer" onClick={handleHome}>
                <img
                  className="h-8 w-8 mr-2 "
                  src="https://friconix.com/png/fi-cnluxl-circle-notch.png"
                  alt=""
                />
                <img
                  src="https://th.bing.com/th/id/R.b94a42acc82b75abc2b6c8754a6fcd8e?rik=CuAobz2IOk3SDw&riu=http%3a%2f%2fwww.tieroom.co.uk%2fmedia%2ftieroom%2flanding_page%2fnotch-logo_transparent_background.png&ehk=FF55qrrs%2f2MYFYJr0i2xjUtqyW0C5kUQzh7xMG%2bYHm8%3d&risl=&pid=ImgRaw&r=0"
                  alt=""
                  className="h-8 w-12 mr-2 sm:hidden sm:w-24 lg:h-16 lg:w-32"
                />
              </div>

              {/* Flyout menus */}
              <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      {({ open }) => (
                        <>
                          <div className="relative flex">
                            <Popover.Button
                              className={classNames(
                                open
                                  ? "border-indigo-600 text-indigo-600"
                                  : "border-transparent text-gray-700 hover:text-gray-800",
                                "relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out"
                              )}
                            >
                              {category.name}
                            </Popover.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-500">
                              {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                              <div
                                className="absolute inset-0 top-1/2 bg-white shadow"
                                aria-hidden="true"
                              />

                              <div className="relative bg-white">
                                <div className="mx-auto max-w-7xl px-8">
                                  <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                                    <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                      {category.featured.map((item) => (
                                        <div
                                          key={item.name}
                                          className="group relative text-base sm:text-sm"
                                        >
                                          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                            <img
                                              src={item.imageSrc}
                                              alt={item.imageAlt}
                                              className="object-cover object-center"
                                            />
                                          </div>
                                          <a
                                            href={item.href}
                                            className="mt-6 block font-medium text-gray-900"
                                          >
                                            <span
                                              className="absolute inset-0 z-10"
                                              aria-hidden="true"
                                            />
                                            {item.name}
                                          </a>
                                          <p
                                            aria-hidden="true"
                                            className="mt-1"
                                          >
                                            Shop Now
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                      {category.sections.map((section) => (
                                        <div key={section.name}>
                                          <p
                                            id={`${section.name}-heading`}
                                            className="font-medium text-gray-900"
                                          >
                                            {section.name}
                                          </p>
                                          <ul
                                            aria-labelledby={`${section.name}-heading`}
                                            className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                          >
                                            {section.items.map((item) => (
                                              <li
                                                key={item.name}
                                                className="flex"
                                              >
                                                <p
                                                  onClick={() =>
                                                    handleCategoryChange(
                                                      category,
                                                      section,
                                                      item,
                                                      close
                                                    )
                                                  }
                                                  className="cursor-pointer hover:text-gray-800"
                                                >
                                                  {item.name}
                                                </p>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  ))}

                  {navigation.pages.map((page) => (
                    <a
                      key={page.name}
                      href={page.href}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      {page.name}
                    </a>
                  ))}
                </div>
              </Popover.Group>

              <div className="ml-auto flex items-center">
                {/* Search */}

                <div className="flex lg:ml-6">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="p-2 text-gry-400 hover:text-gray-500 lg:w-[35rem] sm:w-[5rem]"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                  />
                  <button
                    onClick={handleSearch}
                    className="p-2 text-gry-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon
                      className="h-6 w-6 mr-2"
                      aria-hidden="true"
                    />
                  </button>
                  {/* Display search suggestions */}
                  {searchQuery &&
                    (filteredProducts.length > 0 ? (
                      <div className="absolute z-10 mt-9 p-4 lg:w-[35rem] sm:w-[5rem] bg-white border border-gray-300 rounded-md shadow-lg">
                        {filteredProducts.map((product) => (
                          <div
                            className="flex justify-stretch items-center hover:underline cursor-pointer"
                            key={product._id}
                            onClick={() => navigate(`/product/${product._id}`)}
                          >
                            <Avatar src={product.imageUrl} className="m-2" />
                            {product.title.length > 100 ? (
                              <span title={product.title}>
                                {product.title.slice(0, 100)}...
                              </span>
                            ) : (
                              product.title
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="absolute z-10 mt-9 p-4 w-[15rem] bg-white border border-gray-300 rounded-md shadow-lg">
                        No products found.
                      </p>
                    ))}

                  <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                    {auth.user?.firstName ? (
                      <div>
                        <Avatar
                          className="text-white"
                          onClick={handleUserClick}
                          aria-controls={open ? "basic-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          style={{
                            backgroundColor: "blue",
                            color: "white",
                            cursor: "pointer",
                          }}
                        >
                          {auth.user?.firstName[0].toUpperCase()}
                        </Avatar>
                        <Menu
                          id="basic-menu"
                          anchorEl={anchorEl}
                          open={openUserMenu}
                          onClose={handleCloseUserMenu}
                          MenuListProps={{ "aria-labelledby": "basic-button" }}
                        >
                          <MenuItem onClick={() => handleGoToProfile()}>
                            Profile
                          </MenuItem>
                          <MenuItem onClick={() => handleGoToOrder()}>
                            My Orders
                          </MenuItem>
                          <MenuItem onClick={handleLogout}>Log out</MenuItem>
                        </Menu>
                      </div>
                    ) : (
                      <Button
                        onClick={handleOpen}
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        SignIn
                      </Button>
                    )}
                  </div>
                  {/* Cart */}
                  <div className="ml-4 flow-root lg:ml-6">
                    <Button
                      className="ml-4 flow-root items-center p-2"
                      onClick={handleGoToCart}
                    >
                      <ShoppingBagIcon
                        className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="lg:ml-2 sm:lg-1 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                        {cart.totalItem ? cart.totalItem : 0}
                      </span>
                      <span className="sr-only">items in cart, view bag</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      {loading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <CircularProgress />
        </div>
      )}
      <AuthModal handleClose={handleClose} open={openAuthModel} />
    </div>
  );
}
