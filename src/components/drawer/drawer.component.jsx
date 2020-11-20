import React, { useEffect, useState } from 'react';
import Pagination from '@material-ui/lab/Pagination';
import './drawer.styles.css';
import productData from '../../products';
import ProductListComponent from '../product-list/productList.component';
import { uniq, sortBy, reverse } from 'lodash';
import {
  Grid,
  Radio,
  FormControl,
  FormControlLabel,
  RadioGroup,
  FormLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { sortArrayInDesc, filterArray } from '../../utils';

import DataContext from '../../context';
import FilterComponent from '../filter';

const defaultCount = 10;
const defaultPage = 1;

const Container = () => {
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState({
    page: defaultPage,
    count: productData.length / defaultCount,
  });

  const [romFilter, setRomFilter] = useState([]);
  const [osFilter, setOsFilter] = useState([]);
  const [ramFilter, setRamFilter] = useState([]);
  const [filteredData, setFilterData] = useState(productData);
  const [selectedRadio, setSortByRadio] = useState('default');
  const [selectedPriceRange, setPriceRange] = useState('0');

  /**
   * @description Method which is called to set the Filters
   */
  const setFilters = () => {
    const OS_TYPES = uniq(productData.map((product) => product.os)).sort();
    const RAM_TYPES = sortArrayInDesc(
      uniq(productData.map((product) => product.memory))
    );
    const MEMORY_TYPES = sortArrayInDesc(
      uniq(productData.map((product) => product.storage))
    );

    const osTemp = OS_TYPES.map((type) => ({
      checked: false,
      name: type,
    }));
    setOsFilter(osTemp);
    const ramTemp = RAM_TYPES.map((type) => ({
      checked: false,
      name: type,
    }));
    setRamFilter(ramTemp);
    const romTemp = MEMORY_TYPES.map((type) => ({
      checked: false,
      name: type,
    }));
    setRomFilter(romTemp);
  };

  useEffect(() => {
    setFilters();
    setProductList(productData.slice(defaultPage - 1, defaultCount));
  }, []);

  /**
   * @description Handler to update the Pagination
   */
  const handlePaginationChange = (event, value) => {
    const temp = filteredData.slice(
      (value - 1) * defaultCount,
      value * defaultCount
    );
    setProductList(temp);
    setPage((state) => ({ ...state, page: value }));
  };

  /**
   * @description Handler for updating the filters state
   */

  const handleFilterChange = (name, checked, type) => {
    switch (type) {
      case 'os':
        setOsFilter((state) => {
          const temp = state.findIndex((s) => s.name === name);
          state[temp].checked = checked;
          return [...state];
        });
        break;
      case 'ram':
        setRamFilter((state) => {
          const temp = state.findIndex((s) => s.name === name);
          state[temp].checked = checked;
          return [...state];
        });
        break;
      case 'rom':
        setRomFilter((state) => {
          const temp = state.findIndex((s) => s.name === name);
          state[temp].checked = checked;
          return [...state];
        });
        break;
      default:
        break;
    }
  };

  /**
   * @description Trigerred when the filters are updated
   */
  const filterItems = () => {
    // if (romFilter.length && osFilter.length && ramFilter.length) {
    // console.log({ romFilter, osFilter, ramFilter });
    const romSelected = romFilter.filter((type) => type.checked);
    const ramSelected = ramFilter.filter((type) => type.checked);
    const osSelected = osFilter.filter((type) => type.checked);
    if (
      romSelected.length ||
      ramSelected.length ||
      osSelected.length ||
      selectedPriceRange
    ) {
      const filters = {};
      if (romSelected.length)
        filters.storage = (storage) =>
          romSelected.map((type) => type.name).includes(storage);

      if (ramSelected.length)
        filters.memory = (memory) =>
          ramSelected.map((type) => type.name).includes(memory);
      if (osSelected.length)
        filters.os = (os) => osSelected.map((type) => type.name).includes(os);

      const priceRange = selectedPriceRange.split('-');
      if (priceRange.length === 2) {
        filters.price = (price) =>
          Number(priceRange[0]) < price && Number(priceRange[1]) > price;
      } else if (Number(priceRange[0])) {
        filters.price = (price) => Number(priceRange[0]) < price;
      }
      // console.log(priceRange, filters);

      if (Object.keys(filters).length) {
        const result = filterArray(productData, filters);
        setFilterData(result);
        setPage({ count: Math.round(result.length / defaultCount), page: 1 });
        if (result.length) {
          setProductList(result.slice(0, defaultCount));
        } else {
          setProductList([]);
        }
      } else {
        setProductList(productData.slice(defaultPage - 1, defaultCount));
        setFilterData(productData);
      }

      // console.log(result);
      // console.log({ romSelected, ramSelected, osSelected });
    } else {
      setProductList(productData.slice(defaultPage - 1, defaultCount));
      setFilterData(productData);
    }
    // }
  };

  useEffect(() => {
    filterItems();
  }, [romFilter, osFilter, ramFilter]);

  /**
   * @description Handler to Sort the Products based on Selection
   */
  const handleSortByChange = (event) => {
    const value = event.target.value;
    const sortedData = sortBy(filteredData, 'price');
    setSortByRadio(value);
    setPage((state) => ({ ...state, page: 1 }));
    switch (value) {
      case 'default':
        break;
      case 'lth':
        setProductList(sortedData.slice(0, defaultCount));
        setFilterData(sortedData);
        break;
      case 'htl':
        reverse(sortedData);
        setProductList(sortedData.slice(0, defaultCount));
        setFilterData(sortedData);
        break;
      default:
        break;
    }
  };

  // useEffect(() => {
  //   if (selectedRadio) {
  //     handleSortByChange({ target: { value: selectedRadio } });
  //   }
  // }, [filteredData]);

  /**
   * @description Handler to update the state of the Price range selector
   */
  const handlePriceRangeChange = (event) => {
    const { value } = event.target;
    setPriceRange(value);
  };

  useEffect(() => {
    filterItems();
  }, [selectedPriceRange]);

  return (
    <DataContext.Provider
      value={{
        productList,
        allData: filteredData,
      }}
    >
      <Grid container={true}>
        <Grid item xs={2}>
          <Grid container style={{ marginTop: '100px' }}>
            <Grid item xs={12} className="price-range-container">
              <p>Price Range</p>
              <FormControl style={{ width: '100%' }}>
                <Select
                  labelId="price-select"
                  id="price-select"
                  value={selectedPriceRange}
                  onChange={handlePriceRangeChange}
                >
                  <MenuItem value="0">All</MenuItem>
                  <MenuItem value="0-10000">0-10000</MenuItem>
                  <MenuItem value="10001-20000">10001-20000</MenuItem>
                  <MenuItem value="20001-50000">20001-50000</MenuItem>
                  <MenuItem value="50001-100000">50001-100000</MenuItem>
                  <MenuItem value="100000">{'>'}100000</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend" style={{ textAlign: 'left' }}>
                  Sort By
                </FormLabel>
                <RadioGroup
                  aria-label="sortby"
                  name="sortby"
                  value={selectedRadio}
                  onChange={handleSortByChange}
                >
                  {/* <FormControlLabel
                    value="default"
                    control={<Radio />}
                    label="Popularity"
                  /> */}
                  <FormControlLabel
                    value="lth"
                    control={<Radio color="primary" />}
                    label="Price -- Low to High"
                  />
                  <FormControlLabel
                    value="htl"
                    control={<Radio color="primary" />}
                    label="Price -- High to Low"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FilterComponent
                title="RAM"
                types={ramFilter}
                handleChange={({ target: { name } }, checked) =>
                  handleFilterChange(name, checked, 'ram')
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FilterComponent
                title="OS"
                types={osFilter}
                handleChange={({ target: { name } }, checked) =>
                  handleFilterChange(name, checked, 'os')
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FilterComponent
                title="ROM"
                types={romFilter}
                handleChange={({ target: { name } }, checked) =>
                  handleFilterChange(name, checked, 'rom')
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={10} container>
          <Grid item xs={12}>
            {productList.length ? (
              <ProductListComponent />
            ) : (
              <p style={{ marginTop: '14rem' }}>No Products Available</p>
            )}
          </Grid>
          <Grid item xs={12} className="paginationCotainer">
            <Pagination
              count={page.count}
              page={page.page}
              color="primary"
              onChange={handlePaginationChange}
            />
          </Grid>
        </Grid>
      </Grid>
    </DataContext.Provider>
  );
};

export default Container;
