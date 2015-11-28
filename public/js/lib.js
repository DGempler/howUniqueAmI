var library = {
  totalPop: {
    url: 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B01001&geo_ids=01000US',
  },
  1: {
    url: ['http://api.population.io:80/1.0/population/', '/United%20States/', '/',
              'http://api.population.io:80/1.0/population/United%20States/','-','-','/'],
  },
  2: {
    dataKeys: function(data) {
      var dataObject = {
        totalPop: data.data['01000US'].B01001.estimate.B01001001,
        answerData: {
          'Male': data.data['01000US'].B01001.estimate.B01001002,
          'Female': data.data['01000US'].B01001.estimate.B01001026
        },
      };
      return dataObject;
    },
    text: '% of the US Population is ',
    url: 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B01001&geo_ids=01000US',
    type: 'gender'
  },
  3: {
    dataKeys: function(data) {
      var dataObject = {
        totalPop: data.data['01000US'].B03002.estimate.B03002001,
        answerData: {
          'American Indian or Alaska Native': data.data['01000US'].B03002.estimate.B03002005,
          'Asian': data.data['01000US'].B03002.estimate.B03002006,
          'Black or African American': data.data['01000US'].B03002.estimate.B03002004,
          'Hispanic': data.data['01000US'].B03002.estimate.B03002012,
          'Native Hawaiian or Other Pacific Islander': data.data['01000US'].B03002.estimate.B03002007,
          'White': data.data['01000US'].B03002.estimate.B03002003,
          'Other': data.data['01000US'].B03002.estimate.B03002008,
          'Two or more races': data.data['01000US'].B03002.estimate.B03002009,
        },
      };
      return dataObject;
    },
    text: '% of the US Population is ',
    url: 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B03002&geo_ids=01000US',
    type: 'race'
  },
  4: {
    dataKeys: function(data1, data2) {
      var datum = data1.data['01000US'].B05006.estimate;
      var totalPop = data2.data['01000US'].B01001.estimate.B01001001;
      var dataObject = {
        totalPop: data2.data['01000US'].B01001.estimate.B01001001,
        answerData: {
          'The United States': totalPop - datum.B05006001,
          'Europe': datum.B05006002,
          'Asia': datum.B05006047,
          'Africa': datum.B05006091,
          'Oceania': datum.B05006116,
          'Latin America': datum.B05006123,
          'Other North America': datum.B05006159,
        },
      };
      return dataObject;
    },
    text: '% of the US Population is from ',
    url: ['http://api.censusreporter.org/1.0/data/show/latest?table_ids=B05006&geo_ids=01000US',
            'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B01001&geo_ids=01000US'],
    type: 'born',
  },
  5: {
    dataKeys: function(data) {
      var dataObject = {
        totalPop: data.data['01000US'].B16007.estimate.B16007001,
        answerData: {
          'English only': data.data['01000US'].B16007.estimate.B16007003 + data.data['01000US'].B16007.estimate.B16007009 + data.data['01000US'].B16007.estimate.B16007015,
          'Spanish': data.data['01000US'].B16007.estimate.B16007004 + data.data['01000US'].B16007.estimate.B16007010 + data.data['01000US'].B16007.estimate.B16007016,
          'Other Indo-European': data.data['01000US'].B16007.estimate.B16007005 + data.data['01000US'].B16007.estimate.B16007011 + data.data['01000US'].B16007.estimate.B16007017,
          'Asian/Pacific Islander': data.data['01000US'].B16007.estimate.B16007006 + data.data['01000US'].B16007.estimate.B16007012 + data.data['01000US'].B16007.estimate.B16007018,
          'Other': data.data['01000US'].B16007.estimate.B16007007 + data.data['01000US'].B16007.estimate.B16007013 + data.data['01000US'].B16007.estimate.B16007019,
        },
      };
      return dataObject;
    },
    text: '% of the US Population speaks ',
    url: 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B16007&geo_ids=01000US',
    type: 'language'
  },
  6: {
    dataKeys: function(data) {
      var datum = data.data['01000US'].B15002.estimate;
      var dataObject = {
        totalPop: datum.B15002002 + datum.B15002019,
        answerData: {
          'None thru 8th grade': datum.B15002003 + datum.B15002004 + datum.B15002005 + datum.B15002006 + datum.B15002020 + datum.B15002021 + datum.B15002022 + datum.B15002023,
          '9th - 12th grade, no diploma': datum.B15002007 + datum.B15002008 + datum.B15002009 + datum.B15002010 + datum.B15002024 + datum.B15002025 + datum.B15002026 + datum.B15002027,
          'High school graduate (or equivalent)': datum.B15002011 + datum.B15002028,
          'Some college, no degree': datum.B15002012 + datum.B15002013 + datum.B15002029 + datum.B15002030,
          "Associate's degree": datum.B15002014 + datum.B15002031,
          "Bachelor's degree": datum.B15002015 + datum.B15002032,
          "Master's degree": datum.B15002016 + datum.B15002033,
          'Professional school degree': datum.B15002017 + datum.B15002034,
          'Doctorate degree': datum.B15002018 + datum.B15002035,
        },
      };
      return dataObject;
    },
    text: "% of the US Population (over 25 years old) has an education level of: ",
    url: 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B15002&geo_ids=01000US',
    type: 'education'
  },
  7: {
    dataKeys: function(data) {
      var datum = data.data['01000US'].B23025.estimate;
      var dataObject = {
        totalPop: datum.B23025001,
        answerData: {
          'Employed': datum.B23025004,
          'Unemployed': datum.B23025005,
          'Active Duty Military': datum.B23025006,
          'Not in the labor force': datum.B23025007,
        },
      };
      return dataObject;
    },
    text: "% of the US Population (over 16 years old) is ",
    url: 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B23025&geo_ids=01000US',
    type: 'employment'
  },
  8: {
    dataKeys: function(data) {
      var datum = data.data['01000US'].B19001.estimate;
      var dataObject = {
        totalPop: datum.B19001001,
        answerData: {
          'Less than $25,000': datum.B19001002 + datum.B19001003 + datum.B19001004 + datum.B19001005,
          '$25,000 to $49,999': datum.B19001006 + datum.B19001007 + datum.B19001008 + datum.B19001009 + datum.B19001010,
          '$50,000 to $74,999': datum.B19001011 + datum.B19001012,
          '$75,000 to $99,999': datum.B19001013,
          '$100,000 to $124,999': datum.B19001014,
          '$125,000 to $149,999': datum.B19001015,
          '$150,000 to $199,999': datum.B19001016,
          '$200,000 or more': datum.B19001017,
        },
      };
      return dataObject;
    },
    text: "% of the US Population's annual household income is ",
    url: 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B19001&geo_ids=01000US',
    type: 'income'
  },
  9: {
    dataKeys: function(data) {
      var datum = data.data['01000US'].B25003.estimate;
      var dataObject = {
        totalPop: datum.B25003001,
        answerData: {
          'Own': datum.B25003002,
          'Rent': datum.B25003003,
        },
      };
     return dataObject;
    },
    text: "% of the US Population ",
    url: 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B25003&geo_ids=01000US',
    type: 'tenure'
  },
  10: {
    dataKeys: function(data) {
    var datum = data.data['01000US'].B25024.estimate;
      var dataObject = {
        totalPop: datum.B25024001,
        answerData: {
          'one-family house detached from any other house': datum.B25024002,
          'one-family house attached to one or more houses': datum.B25024003,
          'building with 2 apartments': datum.B25024004,
          'building with 3 or 4 apartments': datum.B25024005,
          'building with 5 to 9 apartments': datum.B25024006,
          'building with 10 to 19 apartments': datum.B25024007,
          'building with 20+ apartments': datum.B25024008 + datum.B25024009,
          'mobile home': datum.B25024010,
          'boat, RV, van, etc.': datum.B25024011
        },
      };
      return dataObject;
    },
  text: "% of the US Population lives in a ",
  url: 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B25024&geo_ids=01000US',
  type: 'housing'
  },
  11: {
    dataKeys: function(data) {
      var datum = data.data['01000US'].B12001.estimate;
      var dataObject = {
        totalPop: datum.B12001001,
        answerData: {
          'Never Married': datum.B12001003 + datum.B12001012,
          'Currently Married': datum.B12001004 + datum.B12001013,
          'Divorced': datum.B12001010 + datum.B12001019,
          'Widowed': datum.B12001009 + datum.B12001018,
        },
      };
      return dataObject;
    },
  text: "% of the US Population (over 15 years old) is ",
  url: 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B12001&geo_ids=01000US',
  type: 'marital'
  },
};